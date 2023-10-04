import { BASE_URL } from "../constants/variables";

const apiRequest = async (url, method = 'GET', data = null) => {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(`${BASE_URL}${url}`, options);

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  if (method === 'DELETE') {
    return;
  }

  return response.json();
};

export const createIssue = async (issue) => {
  return apiRequest('/issues', 'POST', issue);
};

export const getIssues = async () => {
  return apiRequest('/issues');
};

export const updateIssue = async (id, issue) => {
  return apiRequest(`/issue/${id}`, 'PUT', issue);
};

export const deleteIssue = async (id) => {
  return apiRequest(`/issue/${id}`, 'DELETE');
};