/* eslint-disable @typescript-eslint/no-empty-object-type */
import {
  DraggableCollectionStateOptions,
  useDraggableCollectionState,
  useListData,
} from "react-stately";
import {
  GridList,
  GridListItem,
  useDragAndDrop,
  Checkbox as AriaCheckbox,
  CheckboxProps,
  DragAndDropOptions,
} from "react-aria-components";
import { useMemo } from "react";

interface DraggableCollectionStateOpts
  extends Omit<DraggableCollectionStateOptions, "getItems"> {}

function App() {
  const list = useListData({
    initialItems: [
      { id: 1, name: "Adobe Photoshop" },
      { id: 2, name: "Adobe XD" },
      { id: 3, name: "Adobe Dreamweaver" },
      { id: 4, name: "Adobe InDesign" },
      { id: 5, name: "Adobe Connect" },
    ],
  });

  const options = useMemo<DragAndDropOptions>(
    () => ({
      getItems: (keys) =>
        [...keys].map((key) => ({
          "text/plain": list.getItem(key)?.name ?? "",
        })),
      onReorder(e) {
        if (e.target.dropPosition === "before") {
          list.moveBefore(e.target.key, e.keys);
        } else if (e.target.dropPosition === "after") {
          list.moveAfter(e.target.key, e.keys);
        }
      },
    }),
    [list]
  );

  const { dragAndDropHooks } = useDragAndDrop(options);

  dragAndDropHooks.useDraggableCollectionState =
    function useDraggableCollectionStateOverride(
      props: DraggableCollectionStateOpts
    ) {
      const draggableHook = useDraggableCollectionState({
        ...props,
        ...options,
      } as DraggableCollectionStateOptions);
      draggableHook.getKeysForDrag = function (key: string) {
        return new Set([key]); //Just the clicked item be a key for drag
      };
      return draggableHook;
    };

  return (
    <GridList
      aria-label="Reorderable list"
      selectionMode="multiple"
      items={list.items}
      dragAndDropHooks={dragAndDropHooks}
      style={{ marginLeft: "100px" }}
    >
      {(item) => (
        <GridListItem style={{ display: "flex" }}>
          {() => (
            <>
              <Checkbox slot="selection" />
              {item.name}
            </>
          )}
        </GridListItem>
      )}
    </GridList>
  );
}

export function Checkbox(props: CheckboxProps) {
  return (
    <AriaCheckbox {...props} style={{ display: "flex" }}>
      {({ isSelected, isIndeterminate }) => (
        <>
          <div>{isIndeterminate ? "[ ]" : isSelected ? "[x]" : "[ ]"}</div>
          {props.children}
        </>
      )}
    </AriaCheckbox>
  );
}

export default App;
