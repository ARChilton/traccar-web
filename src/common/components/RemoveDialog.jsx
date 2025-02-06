import Button from '@mui/material/Button'
import React from 'react'
import { Snackbar } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import { snackBarDurationLongMs } from '../util/duration'
import { useCatch } from '../../reactHelper'
import { useTranslation } from './LocalizationProvider'

const useStyles = makeStyles((theme) => ({
  root: {
    [theme.breakpoints.down('md')]: {
      bottom: `calc(${theme.dimensions.bottomBarHeight}px + ${theme.spacing(
        1
      )})`,
    },
  },
  button: {
    height: 'auto',
    marginTop: 0,
    marginBottom: 0,
    color: theme.palette.error.main,
  },
}))

const RemoveDialog = ({ open, endpoint, itemId, onResult }) => {
  const classes = useStyles()
  const t = useTranslation()

  const handleRemove = useCatch(async () => {
    const response = await fetch(`/api/${endpoint}/${itemId}`, {
      method: 'DELETE',
    })
    if (response.ok) {
      onResult(true)
    } else {
      throw Error(await response.text())
    }
  })

  return (
    <Snackbar
      className={classes.root}
      open={open}
      autoHideDuration={snackBarDurationLongMs}
      onClose={() => onResult(false)}
      message={t('sharedRemoveConfirm')}
      action={
        <Button
          size='small'
          className={classes.button}
          color='error'
          onClick={handleRemove}
        >
          {t('sharedRemove')}
        </Button>
      }
    />
  )
}

export default RemoveDialog
