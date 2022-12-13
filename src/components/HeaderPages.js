
import {Container, Stack, Typography} from '@mui/material';
import  propTypes  from 'prop-types';
import Button from './Button'

export default function HeaderPage({titlePage,titleButton="New Instance",iconButton = "eva:plus-fill", go="#", variant="contained" }) {
    return(
        <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Typography variant='h4'>
                {titlePage}
            </Typography>

            <Button variant = {variant} go = {go} icon={iconButton} labelButton={titleButton} />
        </Stack>
    </Container>
    )
}

HeaderPage.propTypes = {
    titlePage: propTypes.string.isRequired,
    titleButton: propTypes.string.isRequired,
    iconButton: propTypes.string.isRequired,
    go: propTypes.string.isRequired,
    variant: propTypes.string.isRequired
}