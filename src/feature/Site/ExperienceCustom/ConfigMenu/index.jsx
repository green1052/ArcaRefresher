import { DirectionsRun } from '@material-ui/icons';

import View from './View';
import Info from '../FeatureInfo';

/** @type {ConfigMenuInfo} */
export default {
  key: Info.ID,
  group: 'site',
  Icon: DirectionsRun,
  label: Info.name,
  View,
};
