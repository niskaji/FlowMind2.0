// global.d.ts
import "react";

// drizzle-kit'in Expo sürücüsü, migration SQL dosyalarını babel-plugin-inline-import
// ile string olarak bundle'a gömer (bkz. metro.config.js + babel.config.js).
declare module "*.sql" {
  const content: string;
  export default content;
}

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

