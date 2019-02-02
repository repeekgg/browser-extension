/* eslint-disable new-cap */
import React from 'react'
import List from '@material-ui/core/List'
import {
  SortableContainer,
  SortableElement,
  arrayMove
} from 'react-sortable-hoc'

import ListItemText from './list-item-text'

const SortableItem = SortableElement(({ value }) => (
  <ListItemText button primary={value} />
))

const SortableList = SortableContainer(({ items }) => (
  <List>
    {items.map((item, index) => (
      <SortableItem key={item} index={index} value={`${index + 1}. ${item}`} />
    ))}
  </List>
))

export default ({ items, onSorted }) => {
  const onSortEnd = ({ oldIndex, newIndex }) => {
    onSorted(arrayMove(items, oldIndex, newIndex))
  }

  return <SortableList items={items} onSortEnd={onSortEnd} />
}
