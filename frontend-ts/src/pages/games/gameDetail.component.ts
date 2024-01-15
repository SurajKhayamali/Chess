import { renderBoard } from 'components/board/board.component';

export const component = /*html*/ `
  <div id="boardContainer" class="container"></div>
`;

export const afterInitialize = async (slug: string) => {
  renderBoard('boardContainer', slug);
};
