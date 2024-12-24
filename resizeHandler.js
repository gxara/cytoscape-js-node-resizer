(function () {
  "use strict";

  let activeNode = null;

  const createResizeHandle = (node, cy) => {
    let resizeBox = document.getElementById("resize-box");

    activeNode = node;

    const styles = {
      grapperColor: "#7711C0",
    };

    if (!resizeBox) {
      // Resizer Outline
      resizeBox = document.createElement("div");
      resizeBox.id = "resize-box";
      resizeBox.style.width = node.style("width");
      resizeBox.style.height = node.style("height");
      resizeBox.style.position = "absolute";
      resizeBox.style.border = "1px dashed #999";
      cy.container().appendChild(resizeBox);

      const parentDiv = resizeBox;

      // Grapper Handle - Bottom Right
      let resizeHandleBottomRight = document.createElement("div");
      resizeHandleBottomRight.id = "resize-handle-bottom-right";
      resizeHandleBottomRight.style.width = "8px";
      resizeHandleBottomRight.style.height = "8px";
      resizeHandleBottomRight.style.border = `"4px solid ${styles.grapperColor}"`;
      resizeHandleBottomRight.style.position = "absolute";
      resizeHandleBottomRight.style.cursor = "nwse-resize";
      parentDiv.appendChild(resizeHandleBottomRight);

      // Grapper Handle - Bottom Left
      let resizeHandleBottomLeft = document.createElement("div");
      resizeHandleBottomLeft.id = "resize-handle-bottom-left";
      resizeHandleBottomLeft.style.width = "8px";
      resizeHandleBottomLeft.style.height = "8px";
      resizeHandleBottomLeft.style.border = `"4px solid ${styles.grapperColor}"`;
      resizeHandleBottomLeft.style.position = "absolute";
      resizeHandleBottomLeft.style.cursor = "nesw-resize";
      parentDiv.appendChild(resizeHandleBottomLeft);

      // Grapper Handle - Top Right
      let resizeHandleTopRight = document.createElement("div");
      resizeHandleTopRight.id = "resize-handle-top-right";
      resizeHandleTopRight.style.width = "8px";
      resizeHandleTopRight.style.height = "8px";
      resizeHandleTopRight.style.border = `"4px solid ${styles.grapperColor}"`;
      resizeHandleTopRight.style.position = "absolute";
      resizeHandleTopRight.style.cursor = "nesw-resize";
      parentDiv.appendChild(resizeHandleTopRight);

      // Grapper Handle - Top Left
      let resizeHandleTopLeft = document.createElement("div");
      resizeHandleTopLeft.id = "resize-handle-top-left";
      resizeHandleTopLeft.style.width = "8px";
      resizeHandleTopLeft.style.height = "8px";
      resizeHandleTopLeft.style.border = `"4px solid ${styles.grapperColor}"`;
      resizeHandleTopLeft.style.position = "absolute";
      resizeHandleTopLeft.style.cursor = "nwse-resize";
      parentDiv.appendChild(resizeHandleTopLeft);
    }

    let isResizing = false;
    let initialX = 0;
    let initialY = 0;
    let initialWidth = 0;
    let initialHeight = 0;
    let initialPositionX = 0;
    let initialPositionY = 0;
    let activeCorner = null;

    for (const pos of [
      "bottom-right",
      "bottom-left",
      "top-right",
      "top-left",
    ]) {
      const resizeHandler = document.getElementById(`resize-handle-${pos}`);

      resizeHandler.onmousedown = function (e) {
        e.stopPropagation();
        isResizing = true;
        activeCorner = pos;
        document.body.classList.add("no-select"); // Disable text selection
        initialX = e.clientX;
        initialY = e.clientY;
        initialWidth = parseFloat(node.style("width"));
        initialHeight = parseFloat(node.style("height"));
        initialPositionX = node.position("x");
        initialPositionY = node.position("y");
      };

      resizeHandler.onmouseup = function () {
        if (isResizing) {
          document.body.classList.remove("no-select"); // Re-enable text selection
          isResizing = false;
        }
      };
    }

    document.onmousemove = function (e) {
      if (isResizing) {
        // Calculate deltas adjusted for zoom level
        let deltaX = (e.clientX - initialX) / cy.zoom();
        let deltaY = (e.clientY - initialY) / cy.zoom();

        // Initialize new position and dimensions
        let newNodePosition = { x: initialPositionX, y: initialPositionY };
        let newDimensions = { width: initialWidth, height: initialHeight };

        // Adjust position and dimensions based on the active corner
        switch (activeCorner) {
          case "top-left":
            // Move top-left corner, fix bottom-right
            newNodePosition.x = initialPositionX + deltaX / 2;
            newNodePosition.y = initialPositionY + deltaY / 2;
            newDimensions.width = Math.max(10, initialWidth - deltaX);
            newDimensions.height = Math.max(10, initialHeight - deltaY);
            break;

          case "top-right":
            // Move top-right corner, fix bottom-left
            newNodePosition.x = initialPositionX + deltaX / 2;
            newNodePosition.y = initialPositionY + deltaY / 2;
            newDimensions.width = Math.max(10, initialWidth + deltaX);
            newDimensions.height = Math.max(10, initialHeight - deltaY);
            break;

          case "bottom-left":
            // Move bottom-left corner, fix top-right
            newNodePosition.x = initialPositionX + deltaX / 2;
            newNodePosition.y = initialPositionY + deltaY / 2;
            newDimensions.width = Math.max(10, initialWidth - deltaX);
            newDimensions.height = Math.max(10, initialHeight + deltaY);
            break;

          case "bottom-right":
            // Move bottom-right corner, fix top-left
            newNodePosition.x = initialPositionX + deltaX / 2;
            newNodePosition.y = initialPositionY + deltaY / 2;
            newDimensions.width = Math.max(10, initialWidth + deltaX);
            newDimensions.height = Math.max(10, initialHeight + deltaY);
            break;
        }
        // Apply new dimensions and position to the node
        node.position(newNodePosition);
        node.style(newDimensions);

        positionHandle(node);
        cy.trigger("resizeHandler.nodeUpdated", [
          node,
          newDimensions,
          newNodePosition,
        ]);
      }
    };

    document.onmouseup = function () {
      if (isResizing) {
        document.body.classList.remove("no-select"); // Re-enable text selection
        isResizing = false;
      }
    };

    return;
  };

  const positionHandle = () => {
    const resizeBox = document.getElementById("resize-box");

    if (!resizeBox) return;

    if (!activeNode) return;

    const pos = activeNode.renderedPosition();

    const width = parseFloat(activeNode.renderedStyle("width"));
    const height = parseFloat(activeNode.renderedStyle("height"));

    resizeBox.style.left = `${pos.x}px`;
    resizeBox.style.top = `${pos.y}px`;
    resizeBox.style.width = `${width}px`;
    resizeBox.style.height = `${height}px`;
    resizeBox.style.transform = `translate(-${width / 2}px, -${height / 2}px)`;

    const resizeHandleBottomRight = document.getElementById(
      "resize-handle-bottom-right"
    );
    resizeHandleBottomRight.style.left = `${width - 4}px`;
    resizeHandleBottomRight.style.top = `${height - 4}px`;

    const resizeHandleBottomLeft = document.getElementById(
      "resize-handle-bottom-left"
    );
    resizeHandleBottomLeft.style.left = `-4px`;
    resizeHandleBottomLeft.style.top = `${height - 4}px`;

    const resizeHandleTopRight = document.getElementById(
      "resize-handle-top-right"
    );
    resizeHandleTopRight.style.left = `${width - 4}px`;
    resizeHandleTopRight.style.top = `-4px`;

    const resizeHandleTopLeft = document.getElementById(
      "resize-handle-top-left"
    );
    resizeHandleTopLeft.style.left = `-4px`;
    resizeHandleTopLeft.style.top = `-4px`;
  };

  const destroyResizeHandle = () => {
    const resizeBox = document.getElementById("resize-box");

    if (resizeBox) {
      resizeBox.remove();
    }
  };

  var register = function (cytoscape) {
    if (!cytoscape) {
      return;
    }

    cytoscape("core", "resizeHandler", function (opts) {
      var cy = this;

      cy.on("pan", (event) => positionHandle());
      cy.on("drag", (event) => positionHandle());

      cy.on("vclick", function (event) {
        if (typeof event.target.group !== "function") {
          destroyResizeHandle();
        }
      });

      cy.on("tap", "node", function (evt) {
        const node = evt.target;

        createResizeHandle(node, cy);
        positionHandle(node);
      });

      return this;
    });
  };

  if (typeof module !== "undefined" && module.exports) {
    // expose as a commonjs module
    module.exports = register;
  }

  if (typeof define !== "undefined" && define.amd) {
    // expose as an amd/requirejs module
    define("cytoscape-node-resizer", function () {
      return register;
    });
  }

  if (typeof cytoscape !== "undefined") {
    // expose to global cytoscape (i.e. window.cytoscape)
    register(cytoscape);
  }
})();
