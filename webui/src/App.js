import React, { useState, useEffect } from 'react';
import { createIssue, getIssues, updateIssue, deleteIssue } from './services/apiService';
import {
  Button,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Container,
  Box,
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';

function App() {
  const [issues, setIssues] = useState([]);
  const [newIssue, setNewIssue] = useState({ title: '', description: '' });
  const [editingIssue, setEditingIssue] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchIssues() {
      try {
        const issuesData = await getIssues();
        setIssues(issuesData);
      } catch (error) {
        setError('Error fetching issues');
      }
    }
    fetchIssues();
  }, []);

  const handleCreateIssue = async () => {
    if (newIssue.title && newIssue.description) {
      try {
        const createdIssue = await createIssue(newIssue);
        setIssues([...issues, createdIssue]);
        setNewIssue({ title: '', description: '' }); 
        setError(null);
      } catch (error) {
        setError('Error creating issue');
      }
    }
  };

  const handleUpdateIssue = async () => {
    if (editingIssue && editingIssue.title && editingIssue.description) {
      try {
        const updatedIssue = await updateIssue(editingIssue.id, editingIssue);
        const updatedIssues = issues.map((issue) =>
          issue.id === updatedIssue.id ? updatedIssue : issue
        );
        setIssues(updatedIssues);
        setEditingIssue(null);
        setError(null);
      } catch (error) {
        setError('Error updating issue');
      }
    }
  };

  const handleDeleteIssue = async (id) => {
    try {
      await deleteIssue(id);
      const updatedIssues = issues.filter((issue) => issue.id !== id);
      setIssues(updatedIssues);
      setError(null);
    } catch (error) {
      setError('Error deleting issue');
    }
  };

  return (
    <Container maxWidth="md">
      <div className="App">
        <Typography variant="h3" gutterBottom>
          Issues
        </Typography>
        <div>
          <Typography variant="h4">Create Issue</Typography>
          <Box display="flex">
            <TextField
              label="Title"
              variant="outlined"
              fullWidth
              value={newIssue.title}
              onChange={(e) =>
                setNewIssue({ ...newIssue, title: e.target.value })
              }
            />
            <TextField
              label="Description"
              variant="outlined"
              fullWidth
              value={newIssue.description}
              onChange={(e) =>
                setNewIssue({ ...newIssue, description: e.target.value })
              }
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleCreateIssue}
            >
              Create
            </Button>
          </Box>
        </div>
        {error && <div className="error">{error}</div>}
        <div>
          <Typography variant="h4">Issues List</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {issues.map((issue) => (
                  <TableRow key={issue.id}>
                    <TableCell>{issue.title}</TableCell>
                    <TableCell>{issue.description}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => setEditingIssue(issue)}>
                        <Edit />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteIssue(issue.id)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        {editingIssue && (
          <div>
            <Typography variant="h2">Edit Issue</Typography>
            <TextField
              label="Title"
              variant="outlined"
              fullWidth
              value={editingIssue.title}
              onChange={(e) =>
                setEditingIssue({ ...editingIssue, title: e.target.value })
              }
            />
            <TextField
              label="Description"
              variant="outlined"
              fullWidth
              value={editingIssue.description}
              onChange={(e) =>
                setEditingIssue({ ...editingIssue, description: e.target.value })
              }
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpdateIssue}
            >
              Update
            </Button>
          </div>
        )}
      </div>
    </Container>
  );
}

export default App;