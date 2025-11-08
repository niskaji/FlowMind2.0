// global.d.ts
import "react";

declare global {
  namespace JSX {
    type Element = React.ReactElement<any, any>;
    interface ElementClass extends React.Component<any> {
      render(): React.ReactNode;
    }
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

export { };

