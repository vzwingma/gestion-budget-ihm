import React from 'react'
import {Container, Stack, Typography} from "@mui/material";

const CompteItem = ({compte, selectedCompte, onClick}) => {
    return (
        <Container fluid
                   sx={{
                       backgroundColor: (compte.id === selectedCompte.id ? 'primary.main' : 'unset'),
                       borderRadius: (compte.id === selectedCompte.id ? '5% 0% 5% 0%' : 'unset'),
                       '&:hover': {
                           backgroundColor: 'primary.main',
                           color: 'white',
                           opacity: [0.7, 0.6, 0.5],
                       },
                   }}
                   onClick={onClick}>
            <Stack direction={"row"} spacing={5}>
                <img src={"/img/banques/" + compte.icon} width={50} height={50} alt={compte.libelle}/>
                <Typography variant={"h6"} component="div" align={"left"} sx={{spacing: 2}}>
                    {compte.libelle}
                </Typography>
            </Stack>
        </Container>

    )
};

export default CompteItem
