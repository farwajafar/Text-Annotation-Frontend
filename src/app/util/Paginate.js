import _ from "lodash";

export default function paginate(items, pageNumber, PageSize) {
  const startIndex = (pageNumber - 1) * PageSize;
  return _(items).slice(startIndex).take(PageSize).value();
  // _.slice(items, startIndex)
  // _.take()
}
