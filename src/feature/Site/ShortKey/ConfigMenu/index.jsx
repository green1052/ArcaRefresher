import 'core/types';
import { Group } from '@material-ui/icons';

import View from './View';
import Info from '../FeatureInfo';

/** @type {ConfigMenuInfo} */
export default {
  key: Info.ID,
  Icon: Group,
  label: Info.name,
  View,
};
