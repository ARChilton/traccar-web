import {
  Button,
  FormControlLabel,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableRow,
} from '@mui/material'
import React, { useState } from 'react'
import SearchHeader, { filterByKeyword } from './components/SearchHeader'
import { useDeviceReadonly, useManager } from '../common/util/permissions'

import CollectionActions from './components/CollectionActions'
import CollectionFab from './components/CollectionFab'
import DeviceUsersValue from './components/DeviceUsersValue'
import LinkIcon from '@mui/icons-material/Link'
import PageLayout from '../common/components/PageLayout'
import SettingsMenu from './components/SettingsMenu'
import TableShimmer from '../common/components/TableShimmer'
import { formatTime } from '../common/util/formatter'
import { useEffectAsync } from '../reactHelper'
import { useNavigate } from 'react-router-dom'
import usePersistedState from '../common/util/usePersistedState'
import { useSelector } from 'react-redux'
import useSettingsStyles from './common/useSettingsStyles'
import { useTranslation } from '../common/components/LocalizationProvider'

const DevicesPage = () => {
  const classes = useSettingsStyles()
  const navigate = useNavigate()
  const t = useTranslation()

  const groups = useSelector((state) => state.groups.items)

  const manager = useManager()
  const deviceReadonly = useDeviceReadonly()

  const [timestamp, setTimestamp] = useState(Date.now())
  const [items, setItems] = useState([])
  const [searchKeyword, setSearchKeyword] = useState('')
  const [showAll, setShowAll] = usePersistedState('showAllDevices', false)
  const [loading, setLoading] = useState(false)

  useEffectAsync(async () => {
    setLoading(true)
    try {
      const query = new URLSearchParams({ all: showAll })
      const response = await fetch(`/api/devices?${query.toString()}`)
      if (response.ok) {
        setItems(await response.json())
      } else {
        throw Error(await response.text())
      }
    } finally {
      setLoading(false)
    }
  }, [timestamp, showAll])

  const handleExport = () => {
    window.location.assign('/api/reports/devices/xlsx')
  }

  const actionConnections = {
    key: 'connections',
    title: t('sharedConnections'),
    icon: <LinkIcon fontSize='small' />,
    handler: (deviceId) => navigate(`/settings/device/${deviceId}/connections`),
  }

  return (
    <PageLayout
      menu={<SettingsMenu />}
      breadcrumbs={['settingsTitle', 'deviceTitle']}
    >
      <SearchHeader keyword={searchKeyword} setKeyword={setSearchKeyword} />
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>{t('sharedName')}</TableCell>
            <TableCell>{t('deviceIdentifier')}</TableCell>
            <TableCell>{t('groupParent')}</TableCell>
            <TableCell>{t('sharedPhone')}</TableCell>
            <TableCell>{t('deviceModel')}</TableCell>
            <TableCell>{t('deviceContact')}</TableCell>
            <TableCell>{t('userExpirationTime')}</TableCell>
            {manager && <TableCell>{t('settingsUsers')}</TableCell>}
            <TableCell className={classes.columnAction} />
          </TableRow>
        </TableHead>
        <TableBody>
          {!loading ? (
            items.filter(filterByKeyword(searchKeyword)).map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.uniqueId}</TableCell>
                <TableCell>
                  {item.groupId ? groups[item.groupId]?.name : null}
                </TableCell>
                <TableCell>{item.phone}</TableCell>
                <TableCell>{item.model}</TableCell>
                <TableCell>{item.contact}</TableCell>
                <TableCell>{formatTime(item.expirationTime, 'date')}</TableCell>
                {manager && (
                  <TableCell>
                    <DeviceUsersValue deviceId={item.id} />
                  </TableCell>
                )}
                <TableCell className={classes.columnAction} padding='none'>
                  <CollectionActions
                    itemId={item.id}
                    editPath='/settings/device'
                    endpoint='devices'
                    setTimestamp={setTimestamp}
                    customActions={[actionConnections]}
                    readonly={deviceReadonly}
                  />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableShimmer columns={manager ? 8 : 7} endAction />
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>
              <Button onClick={handleExport} variant='text'>
                {t('reportExport')}
              </Button>
            </TableCell>
            <TableCell colSpan={manager ? 8 : 7} align='right'>
              <FormControlLabel
                control={
                  <Switch
                    checked={showAll}
                    onChange={(e) => setShowAll(e.target.checked)}
                    size='small'
                  />
                }
                label={t('notificationAlways')}
                labelPlacement='start'
                disabled={!manager}
              />
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
      <CollectionFab editPath='/settings/device' />
    </PageLayout>
  )
}

export default DevicesPage
