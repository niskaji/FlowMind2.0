// -----------------------------------------------------------
// 🥧 FlowMind 2.0 — CategoryPieChart Component
// Her dilimin üzerinde yüzdesini gösteren özel pasta grafik (react-native-svg)
// -----------------------------------------------------------

import { View } from 'react-native';
import Svg, { Circle, Path, Text as SvgText } from 'react-native-svg';

export interface PieChartSlice {
  key: string;
  value: number;
  color: string;
}

interface CategoryPieChartProps {
  data: PieChartSlice[];
  size?: number;
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(angleRad), y: cy + r * Math.sin(angleRad) };
}

function describeSlice(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, r, startAngle);
  const end = polarToCartesian(cx, cy, r, endAngle);
  const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 1 ${end.x} ${end.y} Z`;
}

// Dilim rengine göre okunabilir (siyah/beyaz) yazı rengi seçer
function getContrastTextColor(hexColor: string): string {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.55 ? '#2B2118' : '#FFFFFF';
}

export default function CategoryPieChart({ data, size = 140 }: CategoryPieChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  if (total <= 0) return null;

  const radius = size / 2;
  const center = radius;
  const visibleSlices = data.filter(item => item.value > 0);

  // Tek dilim %100 ise dejenere yay (360°) yerine tam daire çiz
  if (visibleSlices.length === 1) {
    const only = visibleSlices[0];
    const textColor = getContrastTextColor(only.color);
    return (
      <View>
        <Svg width={size} height={size}>
          <Circle cx={center} cy={center} r={radius} fill={only.color} />
          <SvgText
            x={center}
            y={center}
            fill={textColor}
            fontSize={16}
            fontWeight="700"
            textAnchor="middle"
            alignmentBaseline="middle"
          >
            %100
          </SvgText>
        </Svg>
      </View>
    );
  }

  let cumulativeAngle = 0;

  return (
    <View>
      <Svg width={size} height={size}>
        {visibleSlices.flatMap(item => {
          const sliceAngle = (item.value / total) * 360;
          const startAngle = cumulativeAngle;
          const endAngle = cumulativeAngle + sliceAngle;
          cumulativeAngle = endAngle;

          const midAngle = (startAngle + endAngle) / 2;
          const labelPoint = polarToCartesian(center, center, radius * 0.62, midAngle);
          const percent = Math.round((item.value / total) * 100);
          const textColor = getContrastTextColor(item.color);

          return [
            <Path
              key={`${item.key}-arc`}
              d={describeSlice(center, center, radius, startAngle, endAngle)}
              fill={item.color}
            />,
            <SvgText
              key={`${item.key}-label`}
              x={labelPoint.x}
              y={labelPoint.y}
              fill={textColor}
              fontSize={12}
              fontWeight="700"
              textAnchor="middle"
              alignmentBaseline="middle"
            >
              {`%${percent}`}
            </SvgText>,
          ];
        })}
      </Svg>
    </View>
  );
}
