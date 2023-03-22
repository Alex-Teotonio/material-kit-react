import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Pagination } from 'swiper';

import 'swiper/swiper-bundle.css';

import {
  IconButton,
  Paper,
  Typography,
  Button,
  Dialog,
} from '@mui/material';

import dashboardLigasImage from '../images/dashboard-ligas.png';
import noLeagues from '../images/NoLeagues.png';
import createLeague from '../images/createLeague.png';
import managementLeague from '../images/managementLeagues.png';


SwiperCore.use([Pagination]);

export default function TutorialCarousel() {
  const { t } = useTranslation();
  const [activeStep, setActiveStep] = useState(0);
  const [open, setOpen] = useState(false);

  const steps = [
    {
      image: noLeagues,
      title: t('tutorialStep1Title'),
      description: t('tutorialStep1Description'),
    },
    {
      image: createLeague,
      title: t('tutorialStep1Title'),
      description: t('tutorialStep2Description'),
    },
    {
      image: managementLeague,
      title: t('tutorialStep3Title'),
      description: t('tutorialStep3Description'),
    },
  ];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => {
      const nextStep = prevActiveStep + 1;
      return nextStep >= steps.length ? 0 : nextStep;
    });
  };
  

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSlideChange = (swiper) => {
    setActiveStep(swiper.activeIndex);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setActiveStep(0);
  };

  return (
    <>
      <IconButton variant="contained" onClick={handleOpen}>
        {t('tutorialButtonOpen')}
      </IconButton>
      <Dialog open={open} onClose={handleClose}>
        <Paper sx={{ p: 2 }}>
          <Typography textAlign='center' variant="h5" gutterBottom>
            {t('tutorialTitle')}
          </Typography>
          <Swiper
            onSlideChange={handleSlideChange}
            pagination={{
              clickable: true,
            }}
          >
            {steps.map((step, index) => (
              <SwiperSlide key={index}>
              <img src={step.image} alt={step.title} />
                <Typography  textAlign="center" variant="body1">{step.description}</Typography>
                {/* <Typography textAlign="center"  variant="h6">{step.title}</Typography> */}
              </SwiperSlide>
            ))}
          </Swiper>
          <div style={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button
              variant="contained"
              disabled={activeStep === 0}
              onClick={handleBack}
            >
              {t('tutorialButtonBack')}
            </Button>
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={activeStep === steps.length - 1}
            >
              {t('tutorialButtonNext')}
            </Button>
          </div>
        </Paper>
      </Dialog>
    </>
  );
}
