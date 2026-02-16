import React, { useState, ReactNode } from 'react';
import { Box, Typography, IconButton, Modal } from '@mui/material';
import { OpenInFull, Close } from '@mui/icons-material';

interface ExpandableSectionProps {
    label: string;
    children: ReactNode;
}

/**
 * Composant générique affichant un titre avec une icône d'agrandissement
 * et un contenu enfant. Le clic sur l'icône affiche le contenu en plein écran.
 */
export const ExpandableDetailSection: React.FC<ExpandableSectionProps> = ({ label, children }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleExpand = () => {
        setIsExpanded(true);
    };

    const handleClose = () => {
        setIsExpanded(false);
    };

    return (
        <>
            {/* Section normale */}
            <Box sx={{ border: '2px solid var(--color-dark-container)', borderRadius: 2, height: "99%", margin: 0.1, padding: 0.5, display: 'flex', flexDirection: 'column' }}>
                {/* En-tête avec label et icône agrandir */}
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '2px solid var(--color-dark-container)',
                    height: 'fit-content',
                }}>
                    <Typography
                        variant="h6"
                        sx={{ paddingLeft: 2, paddingTop: 0.1, paddingBottom: 0.1, color: 'var(--color-heading)' }}>
                        {label}
                    </Typography>
                    <IconButton
                        onClick={handleExpand}
                        sx={{ marginRight: 1 }}
                        aria-label="Agrandir">
                        <OpenInFull />
                    </IconButton>
                </Box>

                {/* Contenu enfant */}
                <Box id={`children-content`} sx={{marginTop: 0.2, flex: 1, overflow: 'auto'}}>
                    {children}
                </Box>
            </Box>

            {/* Modal plein écran */}
            <Modal
                open={isExpanded}
                onClose={handleClose}
                aria-labelledby="expanded-section-title"
                sx={{
                    backgroundColor: 'rgba(0, 0, 0, 0.85)'
                }}>
                <Box sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'var(--color-background)',
                        overflow: 'hidden',
                        padding: 3,
                        border: '2px solid var(--color-dark-container)',
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    {/* En-tête de la modal avec bouton fermer */}
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: 3,
                            borderBottom: '2px solid var(--color-border)',
                            paddingBottom: 2,
                            flexShrink: 0
                        }}>
                        <Typography
                            id="expanded-section-title"
                            variant="h4"
                            sx={{ color: 'var(--color-heading-text)' }}>
                            {label}
                        </Typography>
                        <IconButton
                            onClick={handleClose}
                            aria-label="Fermer"
                            sx={{ marginLeft: 2 }}>
                            <Close />
                        </IconButton>
                    </Box>

                    {/* Contenu enfant en plein écran */}
                    <Box sx={{
                        flex: 1,
                        overflow: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        '& > *': {
                            flex: 1,
                            minHeight: 0
                        }
                    }}>
                        {children}
                    </Box>
                </Box>
            </Modal>
        </>
    );
};
