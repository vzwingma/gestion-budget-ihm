import React from 'react'
import {Container, Stack, Typography} from "@mui/material";

const CompteItem = ({compte, selectedIdCompte, onClick}) => {

    return (
        <Container key={compte.id}
                   sx={{
                       backgroundColor: (compte.id === selectedIdCompte ? 'primary.main' : 'unset'),
                       borderRadius: (compte.id === selectedIdCompte ? '5% 0% 5% 0%' : 'unset'),
                       padding: 1,
                       '&:hover': {
                           backgroundColor: 'primary.main',
                           color: 'white',
                           opacity: [0.8],
                           cursor: 'pointer',
                       }
                   }}
                   onClick={() => onClick(compte)}>
            <Stack direction={"row"} spacing={5}>
                <img src={"/img/banques/" + compte.icon} width={50} height={50} alt={compte.libelle}
                     key={"img_" + compte.id}/>
                <Typography variant={"h6"} key={"lib_" + compte.id}>
                    {compte.libelle}
                </Typography>
            </Stack>
        </Container>

    )
};

export default CompteItem
