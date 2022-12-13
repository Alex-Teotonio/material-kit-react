
import { Link as RouterLink } from 'react-router-dom';
import {Button} from '@mui/material';
import  propTypes  from 'prop-types';
import Iconify from "./Iconify";

export default function ButtonCustomized({variant='contained', go = "#", icon = "eva:plus-fill", labelButton = "New Instance"}) {
    return(
        <Button 
            variant={variant} 
            component={RouterLink} 
            to={go}
            startIcon={
                <Iconify icon={icon} />
            }>
            {labelButton}
        </Button>
    );
}



ButtonCustomized.proTypes = {
    variant: propTypes.string.isRequired,
    go: propTypes.string.isRequired,
    icon: propTypes.string.isRequired,
    labelButton: propTypes.string.isRequired
}
