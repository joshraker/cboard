import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Scannable } from 'react-scannable';

import './Tile.css';

const propTypes = {
  /**
   * Background color
   */
  backgroundColor: PropTypes.string,
  /**
   * Border color
   */
  borderColor: PropTypes.string,
  /**
   * Content of tile
   */
  children: PropTypes.node,
  /**
   * @ignore
   */
  className: PropTypes.string,
  /**
   * Type of tile
   */
  variant: PropTypes.oneOf(['button', 'folder', 'board'])
};

const defaultProps = {};

const Tile = props => {
  const {
    backgroundColor,
    borderColor,
    children,
    className: classNameProp,
    variant,
    onClick,
    ...other
  } = props;

  const folder = variant === 'folder';
  const className = classNames('Tile', classNameProp, {
    'Tile--folder': folder
  });

  const tileShapeClassName = classNames('TileShape', {
    'TileShape--folder': folder
  });

  const tileShapeStyles = {};

  if (borderColor) {
    tileShapeStyles.borderColor = borderColor;
  }

  if (backgroundColor) {
    tileShapeStyles.backgroundColor = backgroundColor;
  }

  const onSelect = (event, scannable, scanner) => {
    if (folder) {
      scanner.reset();
    }
  };

  const dwellMs = 1000;
  const clearAfterMs = 300;

  const [dwelling, setDwelling] = React.useState(false);
  const [dwellStart, setDwellStart] = React.useState(0);
  const [dwellEnd, setDwellEnd] = React.useState(0);
  const [dwellDuration, setDwellDuration] = React.useState(0);
  const [timeoutId, setTimeoutId] = React.useState();

  const onMouseEnter = e => {
    if (onClick != null) {
      let timeout = dwellMs;
      if (Date.now() - dwellEnd < clearAfterMs) {
        // If the mouse was away for less than the clear time, continue from where it left off
        // Otherwise, start over
        timeout -= dwellDuration;
      } else {
        setDwellDuration(0);
      }

      setTimeoutId(setTimeout(onClick, timeout));
    }

    setDwelling(true);
    setDwellStart(Date.now());
  };

  const onMouseLeave = e => {
    const now = Date.now();
    setDwelling(false);
    setDwellEnd(now);
    const duration = dwellDuration + now - dwellStart;
    setDwellDuration(duration > dwellMs ? 0 : duration);

    clearTimeout(timeoutId);
  };

  const remainingDwell = dwellMs - dwellDuration;

  return (
    <Scannable onSelect={onSelect} id={'scannable'}>
      <button
        className={className}
        type="button"
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        {...other}
      >
        <div
          className={`dwell-indicator${dwelling ? ' dwelling' : ''}`}
          style={{
            height: `${(remainingDwell / dwellMs) * 80}%`,
            animationDuration: `${remainingDwell}ms`
          }}
        />
        <div className={tileShapeClassName} style={tileShapeStyles} />
        {children}
      </button>
    </Scannable>
  );
};

Tile.propTypes = propTypes;
Tile.defaultProps = defaultProps;

export default Tile;
