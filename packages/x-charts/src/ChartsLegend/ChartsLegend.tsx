import * as React from 'react';
import PropTypes from 'prop-types';
import { useSlotProps } from '@mui/base/utils';
import { unstable_composeClasses as composeClasses } from '@mui/utils';
import { useThemeProps, useTheme, Theme } from '@mui/material/styles';
import { DrawingContext } from '../context/DrawingProvider';
import { AnchorPosition, Direction, getSeriesToDisplay } from './utils';
import { SeriesContext } from '../context/SeriesContextProvider';
import { ChartsLegendClasses, getLegendUtilityClass } from './chartsLegendClasses';
import { DefaultizedProps } from '../models/helpers';
import { DefaultChartsLegend, LegendRendererProps } from './DefaultChartsLegend';

export interface ChartsLegendSlots {
  /**
   * Custom rendering of the legend.
   * @default DefaultChartsLegend
   */
  legend?: React.JSXElementConstructor<LegendRendererProps>;
}

export interface ChartsLegendSlotProps {
  legend?: Partial<LegendRendererProps>;
}

export type ChartsLegendProps = {
  position?: AnchorPosition;
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<ChartsLegendClasses>;
  /**
   * Set to true to hide the legend.
   * @default false
   */
  hidden?: boolean;
  /**
   * The direction of the legend layout.
   * The default depends on the chart.
   */
  direction?: Direction;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: ChartsLegendSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: ChartsLegendSlotProps;
};

type DefaultizedChartsLegendProps = DefaultizedProps<ChartsLegendProps, 'direction' | 'position'>;

const useUtilityClasses = (ownerState: DefaultizedChartsLegendProps & { theme: Theme }) => {
  const { classes, direction } = ownerState;
  const slots = {
    root: ['root', direction],
    mark: ['mark'],
    label: ['label'],
    series: ['series'],
  };

  return composeClasses(slots, getLegendUtilityClass, classes);
};

const defaultProps = {
  position: { horizontal: 'middle', vertical: 'top' },
  direction: 'row',
} as const;

function ChartsLegend(inProps: ChartsLegendProps) {
  const props: DefaultizedChartsLegendProps = useThemeProps({
    props: { ...defaultProps, ...inProps },
    name: 'MuiChartsLegend',
  });

  const { position, direction, hidden, slots, slotProps } = props;
  const theme = useTheme();
  const classes = useUtilityClasses({ ...props, theme });

  const drawingArea = React.useContext(DrawingContext);
  const series = React.useContext(SeriesContext);

  const seriesToDisplay = getSeriesToDisplay(series);

  const ChartLegendRender = slots?.legend ?? DefaultChartsLegend;
  const chartLegendRenderProps = useSlotProps({
    elementType: ChartLegendRender,
    externalSlotProps: slotProps?.legend,
    additionalProps: {
      position,
      direction,
      classes,
      drawingArea,
      series,
      hidden,
      seriesToDisplay,
    },
    ownerState: {},
  });

  return <ChartLegendRender {...chartLegendRenderProps} />;
}

ChartsLegend.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  /**
   * The direction of the legend layout.
   * The default depends on the chart.
   */
  direction: PropTypes.oneOf(['column', 'row']),
  /**
   * Set to true to hide the legend.
   * @default false
   */
  hidden: PropTypes.bool,
  position: PropTypes.shape({
    horizontal: PropTypes.oneOf(['left', 'middle', 'right']).isRequired,
    vertical: PropTypes.oneOf(['bottom', 'middle', 'top']).isRequired,
  }),
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps: PropTypes.object,
  /**
   * Overridable component slots.
   * @default {}
   */
  slots: PropTypes.object,
} as any;

export { ChartsLegend };
