import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { FaTrash, FaEdit } from "react-icons/fa";

const Container = styled.div`
  background-color: white;
  color: #0d1d2c;
  display: flex;
  flex-direction: column;
  padding: 10px 22px;
  font-size: 18px;
  width: 100%;
  gap: 10px;
  font-weight: bold;
  overflow-y: auto !important;
  & input {
    padding: 10px 12px;
    border-radius: 12px;
    background: #e6e8e9;
    border: 1px solid #e6e8e9;
    outline: none;
  }
`;

const Cell = styled.div`
  background-color: white;
  color: #0d1d2c;
  display: flex;
  flex-direction: row;
  padding: 10px 15px;
  font-size: 14px;
  border-radius: 2px;
  border: 1px solid #e6e8e9;
  align-items: center;
  font-weight: normal;
  justify-content: space-between;
  border-right: 4px solid ${(props) => (props.isExpense ? "red" : "green")};
`;

const EditButton = styled.button`
  background: none;
  border: none;
  color: blue;
  cursor: pointer;
  font-size: 18px;
  margin-right: 10px;
  &:hover {
    color: darkblue;
  }
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: red;
  cursor: pointer;
  font-size: 18px;
  &:hover {
    color: darkred;
  }
`;

const TransactionCell = ({ payload, onDelete, onEdit }) => {
  return (
    <Cell isExpense={payload?.type === "EXPENSE"}>
      <span>{payload?.desc}</span>
      <span>₹{payload?.amount}</span>
      
      <EditButton onClick={() => onEdit(payload)}>
        <FaEdit />
      </EditButton>
     
      <DeleteButton onClick={() => onDelete(payload.id)}>
        <FaTrash />
      </DeleteButton>
    </Cell>
  );
};

const TransactionsComponent = ({ transactions, onDelete, onEdit }) => {
  const [searchText, updateSearchText] = useState("");
  const [filteredTransaction, updateTxn] = useState(transactions);

  const filterData = (searchText) => {
    if (!searchText || !searchText.trim().length) {
      updateTxn(transactions);
      return;
    }
    let txn = [...transactions];
    txn = txn.filter((payload) =>
      payload.desc.toLowerCase().includes(searchText.toLowerCase().trim())
    );
    updateTxn(txn);
  };

  useEffect(() => {
    filterData(searchText);
  }, [transactions]);

  return (
    <Container>
      Transactions
      <input
        placeholder="Search"
        onChange={(e) => {
          updateSearchText(e.target.value);
          filterData(e.target.value);
        }}
      />
      {filteredTransaction?.map((payload) => (
        <TransactionCell
          key={payload.id}
          payload={payload}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </Container>
  );
};

export default TransactionsComponent;
