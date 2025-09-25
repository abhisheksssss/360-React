declare module 'react-360-view' {
  interface ThreeSixtyProps {
    amount?: number;
    imagePath?: string;
    fileName?: string;
    spinReverse?: boolean;
  }

  const ThreeSixty: React.FC<ThreeSixtyProps>;
  export default ThreeSixty;
}