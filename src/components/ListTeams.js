import React, { useEffect, useState } from 'react';
import propTypes from 'prop-types'
import api from '../services/api';

export default function ListTeams({ constraintId, constraintType }) {
  const [teams, setTeams] = useState([]);

  const arrayTeams = [];

  const transformTeams = (teamsArray) => {
    teamsArray.map((team) => arrayTeams.push(team.initials));

    setTeams(arrayTeams.join(';'));
  };

  async function getTeamsByContraintId() {
    if (constraintType === 'CA1') {
      const response = await api.get(`ca1_teams/${constraintId}`);

      transformTeams(response.data);
    }

    if (constraintType === 'CA2') {
      const response = await api.get(`ca2_teams/${constraintId}`);
      transformTeams(response.data);
    }

    if (constraintType === 'CA3') {
      const response = await api.get(`ca3_teams1/${constraintId}`);
      transformTeams(response.data);
    }

    if (constraintType === 'CA4') {
      const response = await api.get(`ca4_teams1/${constraintId}`);
      transformTeams(response.data);
    }

    if (constraintType === 'BR1') {
      const response = await api.get(`br1_teams/${constraintId}`);
      transformTeams(response.data);
    }

    if (constraintType === 'BR2') {
      const response = await api.get(`br2_teams/${constraintId}`);
      transformTeams(response.data);
    }

    if (constraintType === 'FA2') {
      const response = await api.get(`fa2_teams/${constraintId}`);
      transformTeams(response.data);
    }

    if (constraintType === 'SE1') {
      const response = await api.get(`se1_teams/${constraintId}`);
      transformTeams(response.data);
    }
  }

  useEffect(() => {
    getTeamsByContraintId();
  }, []);

  return <div>{teams}</div>;
}


ListTeams.propTypes = {
  constraintId: propTypes.string,
  constraintType: propTypes.string
}