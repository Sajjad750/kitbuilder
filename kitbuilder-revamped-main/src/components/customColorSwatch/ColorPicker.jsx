import React from 'react';
import { SketchPicker } from 'react-color';

export function ColorPickerComponent({ color, onChange }) {
  return (
    <SketchPicker
      color={color}
      onChangeComplete={(colorEvent) => onChange(colorEvent.hex)}
    />
  );
}
