import React, { useEffect, useState } from "react";
import styled from "styled-components";
import OverViewComponent from "./OverViewComponent";
import TransactionsComponent from "./TransactionsComponent";
import ChartComponent from "./ChartComponent";

const Container = styled.div`
  background-color: white;
  color: #0d1d2c;
  display: flex;
  flex-direction: column;
  padding: 10px 22px;
  font-size: 18px;
  width: 360px;
  align-items: center;
  justify-content: space-between;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const FilterContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
  margin-bottom: 20px;
`;

const FilterLabel = styled.label`
  font-size: 14px;
  color: #0d1d2c;
`;

const SearchInput = styled.input`
  padding: 8px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 100%;
  margin-bottom: 10px;
`;

const FilterSelect = styled.select`
  padding: 8px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 100%;
`;

const Button = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;


const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  max-width: 90%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const ModalHeader = styled.h3`
  margin: 0 0 15px;
`;

const ModalInput = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const ModalButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;

const CancelButton = styled.button`
  background-color: #ccc;
  color: #333;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #999;
  }
  margin-left: 10px;
`;

const FilterComponent = ({ onFilterChange }) => {
  const [filterType, setFilterType] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const handleFilterChange = () => {
    onFilterChange({ type: filterType, query: searchQuery });
  };

  return (
    <FilterContainer>
      <div>
        <FilterLabel htmlFor="filterType">Type:</FilterLabel>
        <FilterSelect
          id="filterType"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="ALL">All</option>
          <option value="INCOME">Income</option>
          <option value="EXPENSE">Expense</option>
        </FilterSelect>
      </div>

      <div>
        <FilterLabel htmlFor="searchQuery">Search History:</FilterLabel>
        <SearchInput
          id="searchQuery"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by description"
        />
      </div>

      <Button onClick={handleFilterChange}>Apply Filter</Button>
    </FilterContainer>
  );
};

const HomeComponent = () => {
  const [transactions, updateTransaction] = useState([]);
  const [expense, updateExpense] = useState(0);
  const [income, updateIncome] = useState(0);
  const [filter, setFilter] = useState({ type: "ALL", query: "" });
  const [editingTransaction, setEditingTransaction] = useState(null); // For modal edit state

  const calculateBalance = () => {
    let exp = 0;
    let inc = 0;
    transactions.forEach((payload) =>
      payload.type === "EXPENSE"
        ? (exp += payload.amount)
        : (inc += payload.amount)
    );
    updateExpense(exp);
    updateIncome(inc);
  };

  useEffect(() => calculateBalance(), [transactions]);

  const addTransaction = (payload) => {
    updateTransaction([...transactions, payload]);
  };

  const handleDelete = (transactionId) => {
    const updatedTransactions = transactions.filter(
      (txn) => txn.id !== transactionId
    );
    updateTransaction(updatedTransactions);
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
  };

  const handleSaveEdit = (updatedTransaction) => {
    const updatedTransactions = transactions.map((txn) =>
      txn.id === updatedTransaction.id ? updatedTransaction : txn
    );
    updateTransaction(updatedTransactions);
    setEditingTransaction(null);
  };

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesType = filter.type === "ALL" || transaction.type === filter.type;
    const matchesQuery = filter.query === "" || transaction.description
      .toLowerCase()
      .includes(filter.query.toLowerCase());
    return matchesType && matchesQuery;
  });

  return (
    <Container>
      <OverViewComponent
        expense={expense}
        income={income}
        addTransaction={(payload) =>
          addTransaction({
            ...payload,
            id: Date.now(),
            date: new Date().toISOString().split("T")[0],
          })
        }
      />
      <ChartComponent expense={expense} income={income} />
      <FilterComponent onFilterChange={setFilter} />

      {filteredTransactions.length ? (
        <TransactionsComponent
          transactions={filteredTransactions}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      ) : (
        <p>No transactions match the filter</p>
      )}

      {/* Edit Modal */}
      {editingTransaction && (
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>Edit Transaction</ModalHeader>
            <ModalInput
              type="text"
              defaultValue={editingTransaction.description}
              onChange={(e) =>
                setEditingTransaction({
                  ...editingTransaction,
                  description: e.target.value,
                })
              }
              placeholder="Description"
            />
            <ModalInput
              type="number"
              defaultValue={editingTransaction.amount}
              onChange={(e) =>
                setEditingTransaction({
                  ...editingTransaction,
                  amount: parseFloat(e.target.value),
                })
              }
              placeholder="Amount"
            />
            <div>
              <ModalButton onClick={() => handleSaveEdit(editingTransaction)}>
                Save Changes
              </ModalButton>
              <CancelButton onClick={() => setEditingTransaction(null)}>
                Cancel
              </CancelButton>
            </div>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default HomeComponent;
