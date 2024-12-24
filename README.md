
## Zero dependency extension for Cytoscape.js that adds node resizing functionality.

A replacement for [cytoscape.js-noderesize](https://github.com/jhonatandarosa/cytoscape.js-noderesize)
  and [cytoscape.js-node-editing](https://github.com/iVis-at-Bilkent/cytoscape.js-node-editing) that requires neither jQuery nor Konva

![Export-1735055174526](https://github.com/user-attachments/assets/3ea4de90-9720-40d0-a87c-f80456dec1d0)


## Installation
```
npm install cytoscape-js-node-resizer
```

## Usage
```js
import Cytoscape from "cytoscape";
import resizeHandler from "cytoscape-js-node-resizer";

Cytoscape.use(resizeHandler);

...

cy.resizeHandler({
  grapperColor: "#7711C0", // default color
  grapperRadius: "50%",    // default radius
  grapperSize: "8px",      // default size
});

```
