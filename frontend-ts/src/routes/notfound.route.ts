import { renderNotFound } from '../controllers/notfound.controller';

export const notFoundRoute = {
  path: '(.*)', // optional, matches /anything (lazy match)
  action: renderNotFound,
};
