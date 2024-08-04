import { useRouter } from 'next/router'
import { Box, Typography, Button} from '@mui/material'


const navigateToPantry = () => {
    router.push('/page');
};

export default function Home(){
    return(
        <Box width="100vw" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center" gap={2}>
            <Typography variant="h2" gutterBottom>
                Welcome to Pantry tracker
            </Typography>
            <Typography variant="h6" gutterBottom>
                Track your pantry items and manage your inventory with ease.
            </Typography>
                <Button varaint="contained"> Go to Pantry tracker</Button>
        </Box>
    );
}