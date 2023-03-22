import React, { useState } from 'react';
import { Button, Typography } from '@mui/material';

const MyComponentTutorial = () => {
const [step, setStep] = useState(0);

const handleNextStep = () => {
setStep(step + 1);
}

const handlePrevStep = () => {
setStep(step - 1);
}

// renderiza o conteúdo do tutorial de acordo com o valor de 'step'
const renderStep = () => {
switch (step) {
case 0:
return (
<>
<Typography variant="h5">Bem-vindo ao tutorial do MyComponent</Typography>
<Typography paragraph>Clique no botão abaixo para começar o tutorial.</Typography>
<Button variant="contained" color="primary" onClick={handleNextStep}>Começar</Button>
</>
);
case 1:
return (
<>
<Typography variant="h5">Passo 1</Typography>
<Typography paragraph>Aqui você pode explicar o primeiro passo do tutorial.</Typography>
<Button variant="contained" onClick={handlePrevStep}>Voltar</Button>
<Button variant="contained" color="primary" onClick={handleNextStep}>Próximo</Button>
</>
);
case 2:
return (
<>
<Typography variant="h5">Passo 2</Typography>
<Typography paragraph>Aqui você pode explicar o segundo passo do tutorial.</Typography>
<Button variant="contained" onClick={handlePrevStep}>Voltar</Button>
<Button variant="contained" color="primary" onClick={handleNextStep}>Próximo</Button>
</>
);
case 3:
return (
<>
<Typography variant="h5">Passo 3</Typography>
<Typography paragraph>Aqui você pode explicar o terceiro passo do tutorial.</Typography>
<Button variant="contained" onClick={handlePrevStep}>Voltar</Button>
<Button variant="contained" color="primary" onClick={handleNextStep}>Próximo</Button>
</>
);
case 4:
return (
<>
<Typography variant="h5">Parabéns, você concluiu o tutorial!</Typography>
<Typography paragraph>Clique no botão abaixo para fechar o tutorial.</Typography>
<Button variant="contained" color="primary" onClick={() => setStep(0)}>Fechar</Button>
</>
);
default:
return null;
}
};

return (
<>
{step > 0 && (
<Button variant="contained" onClick={handlePrevStep}>Voltar</Button>
)}
<div>{renderStep()}</div>
{step < 4 && (
<Button variant="contained" color="primary" onClick={handleNextStep}>Próximo</Button>
)}
</>
);
};

export default MyComponentTutorial;