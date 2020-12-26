// These come from the compiled .less file from rc-component.
export const globalStyles = `
.rc-cascader-menus-empty {
  min-height: 100px;
  min-width: 200px;
}

.rc-cascader {
  font-size: 12px;
}
.rc-cascader-menus {
  font-size: 12px;
  overflow: hidden;
  background: #fff;
  position: absolute;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.17);
  white-space: nowrap;
}
.rc-cascader-menus-hidden {
  display: none;
}
.rc-cascader-menus.slide-up-enter,
.rc-cascader-menus.slide-up-appear {
  animation-duration: 0.3s;
  animation-fill-mode: both;
  transform-origin: 0 0;
  opacity: 0;
  animation-timing-function: cubic-bezier(0.08, 0.82, 0.17, 1);
  animation-play-state: paused;
}
.rc-cascader-menus.slide-up-leave {
  animation-duration: 0.3s;
  animation-fill-mode: both;
  transform-origin: 0 0;
  opacity: 1;
  animation-timing-function: cubic-bezier(0.6, 0.04, 0.98, 0.34);
  animation-play-state: paused;
}
.rc-cascader-menus.slide-up-enter.slide-up-enter-active.rc-cascader-menus-placement-bottomLeft,
.rc-cascader-menus.slide-up-appear.slide-up-appear-active.rc-cascader-menus-placement-bottomLeft {
  animation-name: SlideUpIn;
  animation-play-state: running;
}
.rc-cascader-menus.slide-up-enter.slide-up-enter-active.rc-cascader-menus-placement-topLeft,
.rc-cascader-menus.slide-up-appear.slide-up-appear-active.rc-cascader-menus-placement-topLeft {
  animation-name: SlideDownIn;
  animation-play-state: running;
}
.rc-cascader-menus.slide-up-leave.slide-up-leave-active.rc-cascader-menus-placement-bottomLeft {
  animation-name: SlideUpOut;
  animation-play-state: running;
}
.rc-cascader-menus.slide-up-leave.slide-up-leave-active.rc-cascader-menus-placement-topLeft {
  animation-name: SlideDownOut;
  animation-play-state: running;
}
.rc-cascader-menu {
  display: inline-block;
  width: 140px;
  height: 192px;
  list-style: none;
  margin: 0;
  padding: 0;
  border-right: 1px solid #e9e9e9;
  overflow: auto;
}
.rc-cascader-menu:last-child {
  border-right: 0;
}
.rc-cascader-menu-item {
  height: 32px;
  line-height: 32px;
  padding: 0 16px;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: all 0.3s ease;
  position: relative;
}
.rc-cascader-menu-item:hover {
  background: #eaf8fe;
}
.rc-cascader-menu-item-disabled {
  cursor: not-allowed;
  color: #ccc;
}
.rc-cascader-menu-item-disabled:hover {
  background: transparent;
}
.rc-cascader-menu-item-loading:after {
  position: absolute;
  right: 12px;
  content: 'loading';
  color: #aaa;
  font-style: italic;
}
.rc-cascader-menu-item-active {
  background: #d5f1fd;
  font-weight: bold;
}
.rc-cascader-menu-item-active:hover {
  background: #d5f1fd;
  font-weight: bold;
}
.rc-cascader-menu-item-expand {
  position: relative;
}
.rc-cascader-menu-item-expand-icon {
  font-size: 12px;
  color: #999;
  position: absolute;
  right: 16px;
  line-height: 32px;
}
@keyframes SlideUpIn {
  0% {
    opacity: 0;
    transform-origin: 0% 0%;
    transform: scaleY(0.8);
  }
  100% {
    opacity: 1;
    transform-origin: 0% 0%;
    transform: scaleY(1);
  }
}
@keyframes SlideUpOut {
  0% {
    opacity: 1;
    transform-origin: 0% 0%;
    transform: scaleY(1);
  }
  100% {
    opacity: 0;
    transform-origin: 0% 0%;
    transform: scaleY(0.8);
  }
}
@keyframes SlideDownIn {
  0% {
    opacity: 0;
    transform-origin: 0% 100%;
    transform: scaleY(0.8);
  }
  100% {
    opacity: 1;
    transform-origin: 0% 100%;
    transform: scaleY(1);
  }
}
@keyframes SlideDownOut {
  0% {
    opacity: 1;
    transform-origin: 0% 100%;
    transform: scaleY(1);
  }
  100% {
    opacity: 0;
    transform-origin: 0% 100%;
    transform: scaleY(0.8);
  }
}
`;
