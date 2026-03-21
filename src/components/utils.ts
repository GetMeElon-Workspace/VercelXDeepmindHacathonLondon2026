import { Position, Node } from 'reactflow';

// returns the parameters (sx, sy, tx, ty, sourcePos, targetPos) you need to create an edge
export function getEdgeParams(source: Node, target: Node) {
  const [sx, sy, sourcePos] = getParams(source, target);
  const [tx, ty, targetPos] = getParams(target, source);

  return {
    sx,
    sy,
    tx,
    ty,
    sourcePos,
    targetPos,
  };
}

// returns the position (top,right,bottom or right) passed node compared to
function getParams(nodeA: Node, nodeB: Node): [number, number, Position] {
  const centerA = getNodeCenter(nodeA);
  const centerB = getNodeCenter(nodeB);

  const horizontalDiff = Math.abs(centerA.x - centerB.x);
  const verticalDiff = Math.abs(centerA.y - centerB.y);

  let position;

  // when the horizontal difference between the nodes is bigger, we use Position.Left or Position.Right for the handle
  if (horizontalDiff > verticalDiff) {
    position = centerA.x > centerB.x ? Position.Left : Position.Right;
  } else {
    // here the vertical difference between the nodes is bigger, so we use Position.Top or Position.Bottom for the handle
    position = centerA.y > centerB.y ? Position.Top : Position.Bottom;
  }

  const [x, y] = getHandleCoordsByPosition(nodeA, position);
  return [x, y, position];
}

function getHandleCoordsByPosition(node: Node, handlePosition: Position): [number, number] {
  const offsetX = (node.width || 0) / 2;
  const offsetY = (node.height || 0) / 2;

  // React Flow provides positionAbsolute for absolute coordinates
  const x = node.positionAbsolute?.x ?? node.position.x;
  const y = node.positionAbsolute?.y ?? node.position.y;

  switch (handlePosition) {
    case Position.Left:
      return [x, y + offsetY];
    case Position.Right:
      return [x + (node.width || 0), y + offsetY];
    case Position.Top:
      return [x + offsetX, y];
    case Position.Bottom:
      return [x + offsetX, y + (node.height || 0)];
  }
}

function getNodeCenter(node: Node) {
  const x = node.positionAbsolute?.x ?? node.position.x;
  const y = node.positionAbsolute?.y ?? node.position.y;
  return {
    x: x + (node.width || 0) / 2,
    y: y + (node.height || 0) / 2,
  };
}
