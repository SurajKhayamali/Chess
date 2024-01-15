import { ChessBoard } from 'components/chessboard/ChessBoard';

const boardContainerId = 'boardContainer';

export const component = /*html*/ `
  <div id="boardContainer" class="container"></div>
`;

export const afterInitialize = async (slug: string) => {
  new ChessBoard(boardContainerId, slug);
};
