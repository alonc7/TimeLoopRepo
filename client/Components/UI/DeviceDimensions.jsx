import React, { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';

const DeviceDimensions = ({ children }) => {
  const [dimensions, setDimensions] = useState({
    window: Dimensions.get('window'),
    screen: Dimensions.get('screen'),
  });

  useEffect(() => {
    const updateDimensions = ({ window, screen }) => {
      setDimensions({ window, screen });
    };

    Dimensions.addEventListener('change', updateDimensions);

    return () => {
      Dimensions.removeEventListener('change', updateDimensions);
    };
  }, []);

  return children(dimensions);
};

export default DeviceDimensions;
