import React, { useEffect, useState } from 'react';
import { Link } from '@mui/material';
import { useTranslation } from './LocalizationProvider';
import { useCatch } from '../../reactHelper';
import { useAttributePreference } from '../util/preferences';

const What3Words = ({ latitude, longitude, originalAddress }) => {
  const t = useTranslation();

  const key = useAttributePreference('what3WordsToken')
  const [words, setWords] = useState();
  useEffect(() => {
    setWords(originalAddress);
  }, [latitude, longitude, originalAddress]);

  const showWhat3Words = useCatch(async () => {
    const query = new URLSearchParams({ coordinates: `${latitude},${longitude}`, key });
    const response = await fetch(`https://api.what3words.com/v3/convert-to-3wa?${query.toString()}`);
    if (response.ok) {
      const { words } = await response.json()
      setWords(words);
    } else {
      throw Error(await response.text());
    }
  });

  if (words) {
    return words;
  }
  if (key) {
    return (<Link href="#" onClick={showWhat3Words}>{t('showWhat3Words')}</Link>);
  }
  return t('needWhat3WordsApiKey');
};

export default What3Words;
