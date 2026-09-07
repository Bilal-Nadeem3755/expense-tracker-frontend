import api from "./api";


// ==========================================
// Get All Transactions
// ==========================================

export const getTransactions = async (params = {}) => {
  const response = await api.get("/transactions/", {
    params,
  });

  return response.data;
};


// ==========================================
// Get Single Transaction
// ==========================================

export const getTransaction = async (transactionId) => {
  const response = await api.get(
    `/transactions/${transactionId}`
  );

  return response.data;
};


// ==========================================
// Create Transaction
// ==========================================

export const createTransaction = async (transactionData) => {
  const response = await api.post(
    "/transactions/",
    transactionData
  );

  return response.data;
};


// ==========================================
// Update Transaction
// ==========================================

export const updateTransaction = async (
  transactionId,
  transactionData
) => {
  const response = await api.put(
    `/transactions/${transactionId}`,
    transactionData
  );

  return response.data;
};


// ==========================================
// Delete Transaction
// ==========================================

export const deleteTransaction = async (transactionId) => {
  const response = await api.delete(
    `/transactions/${transactionId}`
  );

  return response.data;
};