'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { firestore } from '../firebase';
import { Box, Modal, Typography, Stack, TextField, Button, Card, CardContent, CardActions } from '@mui/material';
import { collection, deleteDoc, doc, getDocs, query, getDoc, setDoc } from 'firebase/firestore';

export default function PantryPage() {
  const [pantry, setPantry] = useState([]);
  const [filteredPantry, setFilteredPantry] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [recipes, setRecipes] = useState([]);

  const updatePantry = async () => {
    const snapshot = query(collection(firestore, 'pantry'));
    const docs = await getDocs(snapshot);
    const pantryList = [];
    docs.forEach((doc) => {
      pantryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setPantry(pantryList);
    setFilteredPantry(pantryList);
  };

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'pantry'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }

    await updatePantry();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'pantry'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }

    await updatePantry();
  };

  const fetchRecipes = async () => {
    const ingredientList = filteredPantry.map(item => item.name).join(', ');
  
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',  // Updated endpoint for chat-based models
        {
          model: 'gpt-3.5-turbo',  // Updated model
          messages: [
            {
              role: 'user',
              content: `Based on the following ingredients: ${ingredientList}, suggest some recipes that use these ingredients. Provide a list of recipes with brief descriptions.`
            }
          ],
          max_tokens: 300,
          temperature: 0.7,
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );
  
      console.log('API Response:', response.data);
  
      const recipesText = response.data.choices[0].message.content.trim();
      if (!recipesText) {
        console.log('No recipes found.');
        setRecipes([]);
      } else {
        const recipesList = recipesText.split('\n').filter(recipe => recipe.trim() !== '');
        console.log('Processed Recipes List:', recipesList);
        setRecipes(recipesList);
      }
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  };
  
  

  useEffect(() => {
    updatePantry();
  }, []);

  useEffect(() => {
    if (searchQuery === '') {
      setFilteredPantry(pantry);
    } else {
      setFilteredPantry(
        pantry.filter(item =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery, pantry]);

  useEffect(() => {
    if (filteredPantry.length > 0) {
      fetchRecipes();
    }
  }, [filteredPantry]);

  useEffect(() => {
    if (filteredPantry.length > 0) {
      fetchRecipes();
    }
  }, [filteredPantry, fetchRecipes]); // Add fetchRecipes to the dependency array

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        p: 4,
        bgcolor: '#F5F5F5',
        backgroundImage: 'url(/pantry-pic.jpeg)', // Background image URL
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Typography variant="h2" color="#4CAF50" mb={4}>
        Pantry Management
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={handleOpen}
        sx={{ mb: 4 }}
      >
        Add New Item
      </Button>

      <TextField
        variant="outlined"
        fullWidth
        placeholder="Search items..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{
          mb: 4, // margin-bottom
          maxWidth: '600px', // max-width
          '& .MuiInputBase-input': {
            color: '#ffffff', // Change text color to white
          },
          '& .MuiInputLabel-root': {
            color: '#ffffff', // Change placeholder color to white
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#ffffff', // Change border color to white
            },
            '&:hover fieldset': {
              borderColor: '#ffffff', // Change border color on hover to white
            },
            '&.Mui-focused fieldset': {
              borderColor: '#ffffff', // Change border color when focused to white
            },
          },
        }}
      />

      <Stack
        direction="row"
        flexWrap="wrap"
        spacing={2}
        justifyContent="center"
        sx={{ width: '100%', maxWidth: '1200px' }}
      >
        {filteredPantry.map(({ name, quantity }) => (
          <Card key={name} sx={{ width: 300, mb: 2 }}>
            <CardContent>
              <Typography variant="h5" component="div" gutterBottom>
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Quantity: {quantity}
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                size="small"
                color="primary"
                onClick={() => addItem(name)}
              >
                Add
              </Button>
              <Button
                size="small"
                color="secondary"
                onClick={() => removeItem(name)}
              >
                Remove
              </Button>
            </CardActions>
          </Card>
        ))}
      </Stack>

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '400px',
            bgcolor: 'white',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack direction="row" spacing={2}>
            <TextField
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                addItem(itemName);
                setItemName('');
                handleClose();
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>

      {/* Recipe suggestions */}
      <Box width="800px" mt={2}>
        <Typography variant="h4" color="#FFFF" mb={2}>Recipe Suggestions:</Typography>
        {recipes.length > 0 ? (
          <Stack spacing={2}>
            {recipes.map((recipe, index) => (
              <Typography key={index} variant="body1" color="#FFFF">{recipe}</Typography>
            ))}
          </Stack>
        ) : (
          <Typography variant="body1" color="#FFFF">No recipes found.</Typography>
        )}
      </Box>
    </Box>
  );
}



