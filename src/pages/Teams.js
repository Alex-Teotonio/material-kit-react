import { Container, Stack, Typography } from "@mui/material";
import {useTranslation} from "react-i18next"
import Page from "../components/Page";
import EditTable from '../components/Table'

export default function Teams() {

  const {t} = useTranslation()
    return (
        <Page title="Teams" >
          <Container>
          <Stack direction="row"  justifyContent="space-between">
          <Typography variant="h4" sx={{ mb: 5 }}>
            {t('teamDashboard')}
          </Typography>
          </Stack>

            <EditTable/>
          </Container>
        </Page>

    );
}