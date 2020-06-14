import { createGlobalStyle, withTheme } from 'styled-components';
import { getHoverColor, getActiveColor, getShadowColor } from './utils';
import { BlocksTheme } from '@sradevski/blocks-ui/dist/theme';

// This has been copied from https://github.com/luffyZh/dynamic-antd-theme/blob/master/src/theme.js and I only took the bits we needed and added it as a styled component so there is no style flash on load.
/* TODO: This is a hacky way of overriding the theme, and it's due to antd limitations. Find a better alternative to antd. */
const StyleHolder = createGlobalStyle<{
  color: string;
  hoverColor: string;
  activeColor: string;
  shadowColor: string;
  dangerColor: string;
}>`
  a {
    color: ${props => props.color};
  }
  a:hover {
    color: ${props => props.hoverColor};
  }
  a:active {
    color: ${props => props.activeColor};
  }
  ::-moz-selection {
    background: ${props => props.color};
  }
  ::selection {
    background: ${props => props.color};
  }
  [ant-click-animating-without-extra-node='true']::after,
  .ant-click-animating-node {
    -webkit-box-shadow: 0 0 0 0 ${props => props.color};
    box-shadow: 0 0 0 0 ${props => props.color};
    -webkit-box-shadow: 0 0 0 0 ${props => props.color};
    box-shadow: 0 0 0 0 ${props => props.color};
  }
  @-webkit-keyframes waveEffect {
    100% {
      -webkit-box-shadow: 0 0 0 ${props => props.color};
      box-shadow: 0 0 0 ${props => props.color};
      -webkit-box-shadow: 0 0 0 6px ${props => props.color};
      box-shadow: 0 0 0 6px ${props => props.color};
    }
  }
  @keyframes waveEffect {
    100% {
      -webkit-box-shadow: 0 0 0 ${props => props.color};
      box-shadow: 0 0 0 ${props => props.color};
      -webkit-box-shadow: 0 0 0 6px ${props => props.color};
      box-shadow: 0 0 0 6px ${props => props.color};
    }
  }
  .ant-alert-info .ant-alert-icon {
    color: ${props => props.color};
  }
  .ant-anchor-ink-ball {
    border: 2px solid ${props => props.color};
  }
  .ant-anchor-link-active > .ant-anchor-link-title {
    color: ${props => props.color};
  }
  .ant-select-auto-complete.ant-select .ant-input:focus,
  .ant-select-auto-complete.ant-select .ant-input:hover {
    border-color: ${props => props.hoverColor};
  }
  .ant-select-selection:hover {
    border-color: ${props => props.hoverColor};
  }
  .ant-select-focused .ant-select-selection,
  .ant-select-selection:focus,
  .ant-select-selection:active {
    border-color: ${props => props.hoverColor};
    -webkit-box-shadow: 0 0 0 2px ${props => props.shadowColor};
    box-shadow: 0 0 0 2px ${props => props.shadowColor};
  }
  .ant-select-open .ant-select-selection {
    border-color: ${props => props.hoverColor};
    -webkit-box-shadow: 0 0 0 2px ${props => props.shadowColor};
    box-shadow: 0 0 0 2px ${props => props.shadowColor};
  }
  .ant-select-dropdown.ant-select-dropdown--multiple
    .ant-select-dropdown-menu-item-selected
    .ant-select-selected-icon,
  .ant-select-dropdown.ant-select-dropdown--multiple
    .ant-select-dropdown-menu-item-selected:hover
    .ant-select-selected-icon {
    color: ${props => props.color};
  }
  .ant-select-dropdown-menu-item:hover:not(.ant-select-dropdown-menu-item-disabled) {
    background-color: ${props => props.shadowColor};
  }
  .ant-select-dropdown-menu-item-active:not(.ant-select-dropdown-menu-item-disabled) {
    background-color: ${props => props.shadowColor};
  }
  .ant-input:hover {
    border-color: ${props => props.hoverColor};
  }
  .ant-input:focus {
    border-color: ${props => props.hoverColor};
    box-shadow: ${props => props.shadowColor};
  }
  .ant-input-group-addon .ant-select-open .ant-select-selection,
  .ant-input-group-addon .ant-select-focused .ant-select-selection {
    color: ${props => props.color};
  }
  .ant-input-affix-wrapper:hover .ant-input:not(.ant-input-disabled) {
    border-color: ${props => props.hoverColor};
  }
  .ant-btn:hover,
  .ant-btn:focus {
    color: ${props => props.hoverColor};
    border-color: ${props => props.hoverColor};
  }
  .ant-btn:active,
  .ant-btn.active {
    border-color: ${props => props.activeColor};
  }
  .ant-btn-primary {
    color: #fff;
    background-color: ${props => props.color};
    border-color: ${props => props.color};
  }
  .ant-btn-primary:hover,
  .ant-btn-primary:focus {
    color: #fff;
    background-color: ${props => props.hoverColor};
    border-color: ${props => props.hoverColor};
  }
  .ant-btn-primary:active,
  .ant-btn-primary.active {
    background-color: ${props => props.activeColor};
    border-color: ${props => props.activeColor};
  }
  .ant-btn-danger:hover,
  .ant-btn-danger:focus {
    color: #fff;
    background-color: ${props => props.dangerColor};
    border-color: ${props => props.dangerColor};
  }
  .ant-btn-group .ant-btn-primary:not(:first-child):not(:last-child) {
    border-right-color: ${props => props.hoverColor};
    border-left-color: ${props => props.hoverColor};
  }
  .ant-btn-group .ant-btn-primary:first-child:not(:last-child) {
    border-right-color: ${props => props.hoverColor};
  }
  .ant-btn-group .ant-btn-primary:last-child:not(:first-child),
  .ant-btn-group .ant-btn-primary + .ant-btn-primary {
    border-left-color: ${props => props.hoverColor};
  }
  .ant-btn-ghost:hover,
  .ant-btn-ghost:focus {
    color: ${props => props.hoverColor};
    border-color: ${props => props.hoverColor};
  }
  .ant-btn-ghost:active,
  .ant-btn-ghost.active {
    color: ${props => props.activeColor};
    border-color: ${props => props.activeColor};
  }
  .ant-btn-dashed:hover,
  .ant-btn-dashed:focus {
    color: ${props => props.hoverColor};
    border-color: ${props => props.hoverColor};
  }
  .ant-btn-dashed:active,
  .ant-btn-dashed.active {
    color: ${props => props.activeColor};
    border-color: ${props => props.activeColor};
  }
  .ant-btn-link {
    color: ${props => props.color};
  }
  .ant-btn-link:hover,
  .ant-btn-link:focus {
    color: ${props => props.hoverColor};
    border-color: transparent;
  }
  .ant-btn-link:active,
  .ant-btn-link.active {
    color: ${props => props.activeColor};
    border-color: transparent;
  }
  .ant-btn-background-ghost.ant-btn-primary {
    color: ${props => props.color};
    border-color: ${props => props.color};
  }
  .ant-btn-background-ghost.ant-btn-primary:hover,
  .ant-btn-background-ghost.ant-btn-primary:focus {
    color: ${props => props.hoverColor};
    border-color: ${props => props.hoverColor};
  }
  .ant-btn-background-ghost.ant-btn-primary:active,
  .ant-btn-background-ghost.ant-btn-primary.active {
    color: ${props => props.activeColor};
    border-color: ${props => props.activeColor};
  }
  .ant-btn-background-ghost.ant-btn-link {
    color: ${props => props.color};
  }
  .ant-btn-background-ghost.ant-btn-link:hover,
  .ant-btn-background-ghost.ant-btn-link:focus {
    color: ${props => props.hoverColor};
  }
  .ant-btn-background-ghost.ant-btn-link:active,
  .ant-btn-background-ghost.ant-btn-link.active {
    color: ${props => props.activeColor};
  }
  .ant-badge-status-processing {
    background-color: ${props => props.color};
  }
  .ant-badge-status-processing::after {
    border: 1px solid ${props => props.color};
  }
  .ant-badge-status-blue {
    background: ${props => props.color};
  }
  .ant-breadcrumb a:hover {
    color: ${props => props.hoverColor};
  }
  .ant-menu-item > a:hover {
    color: ${props => props.color};
  }
  .ant-menu-item:hover,
  .ant-menu-item-active,
  .ant-menu:not(.ant-menu-inline) .ant-menu-submenu-open,
  .ant-menu-submenu-active,
  .ant-menu-submenu-title:hover {
    color: ${props => props.color};
  }
  .ant-menu-item-selected {
    color: ${props => props.color};
  }
  .ant-menu-item-selected > a,
  .ant-menu-item-selected > a:hover {
    color: ${props => props.color};
  }
  .ant-menu:not(.ant-menu-horizontal) .ant-menu-item-selected {
    background-color: ${props => props.shadowColor};
  }
  .ant-menu-submenu-vertical
    > .ant-menu-submenu-title:hover
    .ant-menu-submenu-arrow::after,
  .ant-menu-submenu-vertical-left
    > .ant-menu-submenu-title:hover
    .ant-menu-submenu-arrow::after,
  .ant-menu-submenu-vertical-right
    > .ant-menu-submenu-title:hover
    .ant-menu-submenu-arrow::after,
  .ant-menu-submenu-inline
    > .ant-menu-submenu-title:hover
    .ant-menu-submenu-arrow::after,
  .ant-menu-submenu-vertical
    > .ant-menu-submenu-title:hover
    .ant-menu-submenu-arrow::before,
  .ant-menu-submenu-vertical-left
    > .ant-menu-submenu-title:hover
    .ant-menu-submenu-arrow::before,
  .ant-menu-submenu-vertical-right
    > .ant-menu-submenu-title:hover
    .ant-menu-submenu-arrow::before,
  .ant-menu-submenu-inline
    > .ant-menu-submenu-title:hover
    .ant-menu-submenu-arrow::before {
    background: -webkit-gradient(
      linear,
      left top,
      right top,
      from(${props => props.color}),
      to(${props => props.color})
    );
    background: -webkit-linear-gradient(
      left,
      ${props => props.color},
      ${props => props.color}
    );
    background: linear-gradient(
      to right,
      ${props => props.color},
      ${props => props.color}
    );
  }
  .ant-menu-inline .ant-menu-submenu-selected,
  .ant-menu-vertical .ant-menu-submenu-selected > a,
  .ant-menu-vertical-left .ant-menu-submenu-selected > a,
  .ant-menu-vertical-right .ant-menu-submenu-selected > a,
  .ant-menu-vertical .ant-menu-submenu-selected,
  .ant-menu-vertical-left .ant-menu-submenu-selected,
  .ant-menu-vertical-right .ant-menu-submenu-selected {
    color: ${props => props.color};
  }

  .ant-menu-horizontal > .ant-menu-item:hover,
  .ant-menu-horizontal > .ant-menu-submenu:hover,
  .ant-menu-horizontal > .ant-menu-item-active,
  .ant-menu-horizontal > .ant-menu-submenu-active,
  .ant-menu-horizontal > .ant-menu-item-open,
  .ant-menu-horizontal > .ant-menu-submenu-open,
  .ant-menu-horizontal > .ant-menu-item-selected,
  .ant-menu-horizontal > .ant-menu-submenu-selected {
    color: ${props => props.color};
    border-bottom: 2px solid ${props => props.color};
  }
  .ant-menu-horizontal > .ant-menu-item > a:hover {
    color: ${props => props.color};
  }
  .ant-menu-horizontal > .ant-menu-item-selected > a {
    color: ${props => props.color};
  }
  .ant-menu-vertical .ant-menu-item::after,
  .ant-menu-vertical-left .ant-menu-item::after,
  .ant-menu-vertical-right .ant-menu-item::after,
  .ant-menu-inline .ant-menu-item::after {
    border-right: 3px solid ${props => props.color};
  }
  .ant-menu.ant-menu-dark .ant-menu-item-selected,
  .ant-menu-submenu-popup.ant-menu-dark .ant-menu-item-selected {
    background-color: ${props => props.color};
  }
  .ant-dropdown-menu-item-selected,
  .ant-dropdown-menu-submenu-title-selected,
  .ant-dropdown-menu-item-selected > a,
  .ant-dropdown-menu-submenu-title-selected > a {
    color: ${props => props.color};
    background-color: ${props => props.shadowColor};
  }
  .ant-dropdown-menu-item:hover,
  .ant-dropdown-menu-submenu-title:hover {
    background-color: ${props => props.shadowColor};
  }
  .ant-dropdown-menu-dark .ant-dropdown-menu-item-selected,
  .ant-dropdown-menu-dark .ant-dropdown-menu-item-selected:hover,
  .ant-dropdown-menu-dark .ant-dropdown-menu-item-selected > a {
    background: ${props => props.color};
  }
  .ant-fullcalendar-value:hover {
    background: ${props => props.shadowColor};
  }
  .ant-fullcalendar-value:active {
    background: ${props => props.color};
  }
  .ant-fullcalendar-today .ant-fullcalendar-value,
  .ant-fullcalendar-month-panel-current-cell .ant-fullcalendar-value {
    -webkit-box-shadow: 0 0 0 1px ${props => props.color} inset;
    box-shadow: 0 0 0 1px ${props => props.color} inset;
  }
  .ant-fullcalendar-fullscreen .ant-fullcalendar-month:hover,
  .ant-fullcalendar-fullscreen .ant-fullcalendar-date:hover {
    background: ${props => props.shadowColor};
  }
  .ant-fullcalendar-fullscreen .ant-fullcalendar-month:active,
  .ant-fullcalendar-fullscreen .ant-fullcalendar-date:active {
    background: ${props => props.shadowColor};
  }
  .ant-fullcalendar-fullscreen
    .ant-fullcalendar-month-panel-current-cell
    .ant-fullcalendar-month,
  .ant-fullcalendar-fullscreen .ant-fullcalendar-today .ant-fullcalendar-date {
    border-top-color: ${props => props.color};
  }
  .ant-fullcalendar-fullscreen
    .ant-fullcalendar-month-panel-selected-cell
    .ant-fullcalendar-value,
  .ant-fullcalendar-fullscreen
    .ant-fullcalendar-selected-day
    .ant-fullcalendar-value {
    color: ${props => props.color};
  }
  .ant-fullcalendar-fullscreen
    .ant-fullcalendar-month-panel-selected-cell
    .ant-fullcalendar-month,
  .ant-fullcalendar-fullscreen
    .ant-fullcalendar-selected-day
    .ant-fullcalendar-date {
    background: ${props => props.shadowColor};
  }
  .ant-radio-wrapper:hover .ant-radio,
  .ant-radio:hover .ant-radio-inner,
  .ant-radio-input:focus + .ant-radio-inner {
    border-color: ${props => props.color};
  }
  .ant-radio-checked::after {
    border: 1px solid ${props => props.color};
  }
  .ant-radio-inner::after {
    background-color: ${props => props.color};
  }
  .ant-radio-checked .ant-radio-inner {
    border-color: ${props => props.color};
  }
  .ant-radio-button-wrapper:hover {
    color: ${props => props.color};
  }
  .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled),
  .ant-radio-button-wrapper-checked {
    color: ${props => props.color};
    border-color: ${props => props.color};
    -webkit-box-shadow: -1px 0 0 0 ${props => props.color};
    box-shadow: -1px 0 0 0 ${props => props.color};
  }
  .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled):hover {
    color: ${props => props.hoverColor};
    border-color: ${props => props.hoverColor};
    -webkit-box-shadow: -1px 0 0 0 ${props => props.hoverColor};
    box-shadow: -1px 0 0 0 ${props => props.hoverColor};
  }
  .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled):first-child {
    border-color: ${props => props.color} !important;
  }
  .ant-radio-button-wrapper-checked::before {
    background-color: ${props => props.color} !important;
    opacity: 0.1;
  }
  .ant-radio-button-wrapper-checked:first-child {
    border-color: ${props => props.color};
    -webkit-box-shadow: none !important;
    box-shadow: none !important;
  }
  .ant-radio-button-wrapper-checked:hover {
    color: ${props => props.hoverColor};
    border-color: ${props => props.hoverColor};
    -webkit-box-shadow: -1px 0 0 0 ${props => props.hoverColor};
    box-shadow: -1px 0 0 0 ${props => props.hoverColor};
  }
  .ant-radio-button-wrapper-checked:active {
    color: ${props => props.activeColor} !important;
    border-color: ${props => props.activeColor} !important;
    -webkit-box-shadow: -1px 0 0 0 ${props => props.activeColor} !important;
    box-shadow: -1px 0 0 0 ${props => props.activeColor} !important;
  }
  .ant-radio-button-wrapper-checked:focus-within {
    outline: 3px solid rgba(24, 144, 255, 0.06);
  }
  .ant-radio-group-solid
    .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled) {
    color: #fff;
    background: ${props => props.color};
    border-color: ${props => props.color};
  }
  .ant-radio-group-solid
    .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled):hover {
    color: #fff;
    background: ${props => props.hoverColor};
    border-color: ${props => props.hoverColor};
  }
  .ant-radio-group-solid
    .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled):active {
    color: #fff;
    background: ${props => props.activeColor};
    border-color: ${props => props.activeColor};
  }
  .ant-card-actions > li > span:hover {
    color: ${props => props.color};
    -webkit-transition: color 0.3s;
    transition: color 0.3s;
  }
  .ant-card-actions > li > span a:hover {
    color: ${props => props.color};
  }
  .ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab-active {
    color: ${props => props.color};
  }
  .ant-tabs-extra-content .ant-tabs-new-tab:hover {
    color: ${props => props.color};
    border-color: ${props => props.color};
  }
  .ant-tabs .ant-tabs-card-bar.ant-tabs-bottom-bar .ant-tabs-tab-active {
    color: ${props => props.color};
  }
  .ant-tabs-ink-bar {
    background-color: ${props => props.color};
  }
  .ant-tabs-nav .ant-tabs-tab:hover {
    color: ${props => props.hoverColor};
  }
  .ant-tabs-nav .ant-tabs-tab:active {
    color: ${props => props.activeColor};
  }
  .ant-tabs-nav .ant-tabs-tab-active {
    color: ${props => props.color};
  }
  .ant-cascader-picker:focus .ant-cascader-input {
    border-color: ${props => props.hoverColor};
    -webkit-box-shadow: 0 0 0 2px ${props => props.shadowColor};
    box-shadow: 0 0 0 2px ${props => props.shadowColor};
  }
  .ant-cascader-picker-label:hover + .ant-cascader-input {
    border-color: ${props => props.hoverColor};
  }
  .ant-cascader-menu-item:hover {
    background: ${props => props.shadowColor};
  }
  .ant-checkbox-wrapper:hover .ant-checkbox-inner,
  .ant-checkbox:hover .ant-checkbox-inner,
  .ant-checkbox-input:focus + .ant-checkbox-inner {
    border-color: ${props => props.color};
  }
  .ant-checkbox-checked::after {
    border: 1px solid ${props => props.color};
  }
  .ant-checkbox-checked .ant-checkbox-inner {
    background-color: ${props => props.color};
    border-color: ${props => props.color};
  }
  .ant-checkbox-indeterminate .ant-checkbox-inner::after {
    background-color: ${props => props.color};
  }
  .ant-calendar-selected-day .ant-calendar-date {
    background: ${props => props.shadowColor};
  }
  .ant-calendar-picker:hover
    .ant-calendar-picker-input:not(.ant-input-disabled) {
    border-color: ${props => props.color};
  }
  .ant-calendar-picker:focus
    .ant-calendar-picker-input:not(.ant-input-disabled) {
    border-color: ${props => props.hoverColor};
    -webkit-box-shadow: 0 0 0 2px ${props => props.shadowColor};
    box-shadow: 0 0 0 2px ${props => props.shadowColor};
  }
  .ant-calendar-header a:hover {
    color: ${props => props.hoverColor};
  }
  .ant-calendar-date:hover {
    background: ${props => props.shadowColor};
  }
  .ant-calendar-date:active {
    background: ${props => props.hoverColor};
  }
  .ant-calendar-today .ant-calendar-date {
    color: ${props => props.color};
    border-color: ${props => props.color};
  }
  .ant-calendar-range .ant-calendar-selected-start-date .ant-calendar-date,
  .ant-calendar-range .ant-calendar-selected-end-date .ant-calendar-date {
    background: ${props => props.color};
  }
  .ant-calendar-range
    .ant-calendar-selected-start-date
    .ant-calendar-date:hover,
  .ant-calendar-range .ant-calendar-selected-end-date .ant-calendar-date:hover {
    background: ${props => props.hoverColor};
  }
  .ant-calendar-selected-date .ant-calendar-date,
  .ant-calendar-selected-start-date .ant-calendar-date,
  .ant-calendar-selected-end-date .ant-calendar-date {
    background: ${props => props.color};
    color: #fff;
  }
  .ant-calendar-selected-date .ant-calendar-date:hover,
  .ant-calendar-selected-start-date .ant-calendar-date:hover,
  .ant-calendar-selected-end-date .ant-calendar-date:hover {
    background: ${props => props.color};
    color: #fff;
  }
  .ant-calendar .ant-calendar-ok-btn {
    background-color: ${props => props.color};
    border-color: ${props => props.color};
  }
  .ant-calendar .ant-calendar-ok-btn:hover,
  .ant-calendar .ant-calendar-ok-btn:focus {
    background-color: ${props => props.hoverColor};
    border-color: ${props => props.hoverColor};
  }
  .ant-calendar .ant-calendar-ok-btn:active,
  .ant-calendar .ant-calendar-ok-btn.active {
    background-color: ${props => props.activeColor};
    border-color: ${props => props.activeColor};
  }
  .ant-calendar-range .ant-calendar-input:hover,
  .ant-calendar-range .ant-calendar-time-picker-input:hover {
    border-color: ${props => props.hoverColor};
  }
  .ant-calendar-range .ant-calendar-input:focus,
  .ant-calendar-range .ant-calendar-time-picker-input:focus {
    border-color: ${props => props.hoverColor};
    -webkit-box-shadow: 0 0 0 2px ${props => props.shadowColor};
    box-shadow: 0 0 0 2px ${props => props.shadowColor};
  }
  .ant-calendar-month-panel-header a:hover {
    color: ${props => props.hoverColor};
  }
  .ant-calendar-month-panel-selected-cell .ant-calendar-month-panel-month {
    background: ${props => props.color};
  }
  .ant-calendar-month-panel-selected-cell
    .ant-calendar-month-panel-month:hover {
    background: ${props => props.color};
  }
  .ant-calendar-year-panel-header a:hover {
    color: ${props => props.hoverColor};
  }
  .ant-calendar-year-panel-selected-cell .ant-calendar-year-panel-year {
    background: ${props => props.color};
  }
  .ant-calendar-year-panel-selected-cell .ant-calendar-year-panel-year:hover {
    background: ${props => props.color};
  }
  .ant-calendar-decade-panel-header a:hover {
    color: ${props => props.hoverColor};
  }
  .ant-calendar-decade-panel-selected-cell .ant-calendar-decade-panel-decade {
    background: ${props => props.color};
  }
  .ant-calendar-decade-panel-selected-cell
    .ant-calendar-decade-panel-decade:hover {
    background: ${props => props.color};
  }
  .ant-calendar-range .ant-calendar-in-range-cell::before {
    background: ${props => props.shadowColor};
  }
  .ant-calendar-time-picker-select li:hover {
    background: ${props => props.shadowColor};
  }
  .ant-calendar-month-panel-month:hover {
    background: ${props => props.shadowColor};
  }
  .ant-calendar-year-panel-year:hover {
    background: ${props => props.shadowColor};
  }
  .ant-calendar-decade-panel-decade:hover {
    background: ${props => props.shadowColor};
  }
  .ant-calendar-week-number .ant-calendar-body tr:hover {
    background: ${props => props.shadowColor};
  }
  .ant-calendar-week-number .ant-calendar-body tr.ant-calendar-active-week {
    background: ${props => props.shadowColor};
  }
  .ant-time-picker-input:hover {
    border-color: ${props => props.hoverColor};
  }
  .ant-time-picker-input:focus {
    border-color: ${props => props.hoverColor};
    -webkit-box-shadow: 0 0 0 2px ${props => props.shadowColor};
    box-shadow: 0 0 0 2px ${props => props.shadowColor};
  }
  .ant-time-picker-panel-select li:hover {
    background: ${props => props.shadowColor};
  }
  .ant-tag-checkable:not(.ant-tag-checkable-checked):hover {
    color: ${props => props.color};
  }
  .ant-tag-checkable-checked {
    background-color: ${props => props.color};
  }
  .ant-tag-checkable:active {
    background-color: ${props => props.activeColor};
  }
  .ant-transfer-list-content-item:not(.ant-transfer-list-content-item-disabled):hover {
    background-color: ${props => props.shadowColor};
  }
  .has-error .ant-transfer-list-search:not([disabled]):hover {
    border-color: ${props => props.hoverColor};
    border-right-width: 1px !important;
  }
  .has-error .ant-transfer-list-search:not([disabled]):focus {
    border-color: ${props => props.hoverColor};
    -webkit-box-shadow: 0 0 0 2px ${props => props.shadowColor};
    box-shadow: 0 0 0 2px ${props => props.shadowColor};
  }
  .is-validating.has-feedback .ant-form-item-children-icon {
    color: ${props => props.color};
  }
  .ant-input-number:hover {
    border-color: ${props => props.hoverColor};
  }
  .ant-input-number:focus {
    border-color: ${props => props.hoverColor};
    -webkit-box-shadow: 0 0 0 2px ${props => props.shadowColor};
    box-shadow: 0 0 0 2px ${props => props.shadowColor};
  }
  .ant-input-number-handler:hover .ant-input-number-handler-up-inner,
  .ant-input-number-handler:hover .ant-input-number-handler-down-inner {
    color: ${props => props.hoverColor};
  }
  .ant-input-number:hover {
    border-color: ${props => props.hoverColor};
    border-right-width: 1px !important;
  }
  .ant-input-number-focused {
    border-color: ${props => props.hoverColor};
    -webkit-box-shadow: 0 0 0 2px ${props => props.shadowColor};
    box-shadow: 0 0 0 2px ${props => props.shadowColor};
  }
  .ant-list-item-meta-title > a:hover {
    color: ${props => props.color};
  }
  .ant-spin {
    color: ${props => props.color};
  }
  .ant-spin-dot-item {
    background-color: ${props => props.color};
  }
  .ant-pagination-item:focus,
  .ant-pagination-item:hover {
    border-color: ${props => props.color};
  }
  .ant-pagination-item:focus a,
  .ant-pagination-item:hover a {
    color: ${props => props.color};
  }
  .ant-pagination-item-active {
    border-color: ${props => props.color};
  }
  .ant-pagination-item-active a {
    color: ${props => props.color};
  }
  .ant-pagination-item-active:focus,
  .ant-pagination-item-active:hover {
    border-color: ${props => props.hoverColor};
  }
  .ant-pagination-item-active:focus a,
  .ant-pagination-item-active:hover a {
    color: ${props => props.hoverColor};
  }
  .ant-pagination-jump-prev
    .ant-pagination-item-container
    .ant-pagination-item-link-icon,
  .ant-pagination-jump-next
    .ant-pagination-item-container
    .ant-pagination-item-link-icon {
    color: ${props => props.color};
  }
  .ant-pagination-prev:hover a,
  .ant-pagination-next:hover a {
    border-color: ${props => props.hoverColor};
  }
  .ant-pagination-prev:focus .ant-pagination-item-link,
  .ant-pagination-next:focus .ant-pagination-item-link,
  .ant-pagination-prev:hover .ant-pagination-item-link,
  .ant-pagination-next:hover .ant-pagination-item-link {
    color: ${props => props.color};
    border-color: ${props => props.color};
  }
  .ant-pagination-options-quick-jumper input:hover {
    border-color: ${props => props.hoverColor};
  }
  .ant-pagination-options-quick-jumper input:focus {
    border-color: ${props => props.hoverColor};
    -webkit-box-shadow: 0 0 0 2px ${props => props.shadowColor};
    box-shadow: 0 0 0 2px ${props => props.shadowColor};
  }
  .ant-pagination-simple .ant-pagination-simple-pager input:hover {
    border-color: ${props => props.color};
  }
  .ant-mention-wrapper .ant-mention-editor:hover {
    border-color: ${props => props.hoverColor};
  }
  .ant-mention-wrapper .ant-mention-editor:focus {
    border-color: ${props => props.hoverColor};
    -webkit-box-shadow: 0 0 0 2px ${props => props.shadowColor};
    box-shadow: 0 0 0 2px ${props => props.shadowColor};
  }
  .ant-mention-wrapper.ant-mention-active:not(.disabled) .ant-mention-editor {
    border-color: ${props => props.hoverColor};
    -webkit-box-shadow: 0 0 0 2px ${props => props.shadowColor};
    box-shadow: 0 0 0 2px ${props => props.shadowColor};
  }
  .ant-mention-dropdown-notfound.ant-mention-dropdown-item .anticon-loading {
    color: ${props => props.color};
  }
  .ant-mentions:hover {
    border-color: ${props => props.hoverColor};
  }
  .ant-mentions:focus {
    border-color: ${props => props.hoverColor};
    -webkit-box-shadow: 0 0 0 2px ${props => props.shadowColor};
    box-shadow: 0 0 0 2px ${props => props.shadowColor};
  }
  .ant-mentions-focused {
    border-color: ${props => props.hoverColor};
    -webkit-box-shadow: 0 0 0 2px ${props => props.shadowColor};
    box-shadow: 0 0 0 2px ${props => props.shadowColor};
  }
  .ant-mention-dropdown-item:hover {
    background-color: ${props => props.shadowColor};
  }
  .ant-mention-dropdown-item.focus,
  .ant-mention-dropdown-item-active {
    background-color: ${props => props.shadowColor};
  }
  .ant-mentions-dropdown-menu-item:hover {
    background-color: ${props => props.shadowColor};
  }
  .ant-mentions-dropdown-menu-item-active {
    background-color: ${props => props.shadowColor};
  }
  .ant-message-info .anticon,
  .ant-message-loading .anticon {
    color: ${props => props.color};
  }
  .ant-modal-confirm-info .ant-modal-confirm-body > .anticon {
    color: ${props => props.color};
  }
  .anticon.ant-notification-notice-icon-info {
    color: ${props => props.color};
  }
  .ant-page-header-back-button {
    color: ${props => props.color};
  }
  .ant-page-header-back-button:focus,
  .ant-page-header-back-button:hover {
    color: ${props => props.hoverColor};
  }
  .ant-page-header-back-button:active {
    color: ${props => props.activeColor};
  }
  .ant-progress-circle-path {
    stroke: ${props => props.color};
  }
  .ant-progress-success-bg,
  .ant-progress-bg {
    background-color: ${props => props.color};
  }
  .ant-slider {
    width: 100%;
  }
  .ant-slider-track {
    background-color: ${props => props.hoverColor};
  }
  .ant-slider-handle {
    border: solid 2px ${props => props.hoverColor};
  }
  .ant-slider-handle:focus {
    border-color: ${props => props.hoverColor};
    box-shadow: 0 0 0 5px ${props => props.shadowColor};
    outline: none;
  }
  .ant-slider-handle.ant-tooltip-open {
    border-color: ${props => props.color};
  }
  .ant-slider:hover .ant-slider-track {
    background-color: ${props => props.hoverColor};
  }
  .ant-slider:hover .ant-slider-handle:not(.ant-tooltip-open) {
    border-color: ${props => props.hoverColor};
  }
  .ant-slider-dot-active {
    border-color: ${props => props.activeColor};
  }
  .ant-steps-item-icon > .ant-steps-icon {
    color: ${props => props.color};
  }
  .ant-steps-item-process .ant-steps-item-icon {
    background-color: #fff;
    border-color: ${props => props.color};
  }
  .ant-steps-item-process .ant-steps-item-icon > .ant-steps-icon {
    color: #fff;
  }
  .ant-steps-item-process
    .ant-steps-item-icon
    > .ant-steps-icon
    .ant-steps-icon-dot {
    background: ${props => props.color};
  }
  .ant-steps-item-process .ant-steps-item-icon {
    background: ${props => props.color};
  }
  .ant-steps-item-finish .ant-steps-item-icon {
    border-color: ${props => props.color};
  }
  .ant-steps-item-finish .ant-steps-item-icon > .ant-steps-icon {
    color: ${props => props.color};
  }
  .ant-steps-item-finish
    .ant-steps-item-icon
    > .ant-steps-icon
    .ant-steps-icon-dot {
    background: ${props => props.color};
  }
  .ant-steps-item-finish
    > .ant-steps-item-content
    > .ant-steps-item-title::after {
    background-color: ${props => props.color};
  }
  .ant-steps-item-finish > .ant-steps-item-tail::after {
    background-color: ${props => props.color};
  }
  .ant-steps-item[role='button']:not(.ant-steps-item-process):hover
    .ant-steps-item-title,
  .ant-steps-item[role='button']:not(.ant-steps-item-process):hover
    .ant-steps-item-description {
    color: ${props => props.color};
  }
  .ant-steps-item[role='button']:not(.ant-steps-item-process):hover
    .ant-steps-item-icon {
    border-color: ${props => props.color};
  }
  .ant-steps-item[role='button']:not(.ant-steps-item-process):hover
    .ant-steps-item-icon
    .ant-steps-icon {
    color: ${props => props.color};
  }
  .ant-steps-item-custom.ant-steps-item-process
    .ant-steps-item-icon
    > .ant-steps-icon {
    color: ${props => props.color};
  }
  .ant-switch-checked.ant-switch-loading .ant-switch-loading-icon {
    color: ${props => props.color};
  }
  .ant-switch-checked {
    background-color: ${props => props.color};
  }
  .ant-table-thead > tr > th .ant-table-filter-selected.anticon-filter {
    color: ${props => props.color};
  }
  .ant-table-thead
    > tr
    > th
    .ant-table-column-sorter
    .ant-table-column-sorter-inner
    .ant-table-column-sorter-up.on,
  .ant-table-thead
    > tr
    > th
    .ant-table-column-sorter
    .ant-table-column-sorter-inner
    .ant-table-column-sorter-down.on {
    color: ${props => props.color};
  }
  .ant-table-filter-dropdown
    .ant-dropdown-menu
    .ant-dropdown-submenu-contain-selected
    .ant-dropdown-menu-submenu-title::after {
    color: ${props => props.color};
  }
  .ant-table-filter-dropdown-link {
    color: ${props => props.color};
  }
  .ant-table-filter-dropdown-link:hover {
    color: ${props => props.hoverColor};
  }
  .ant-table-filter-dropdown-link:active {
    color: ${props => props.activeColor};
  }
  .ant-table-thead
    > tr.ant-table-row-hover:not(.ant-table-expanded-row):not(.ant-table-row-selected)
    > td,
  .ant-table-tbody
    > tr.ant-table-row-hover:not(.ant-table-expanded-row):not(.ant-table-row-selected)
    > td,
  .ant-table-thead
    > tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected)
    > td,
  .ant-table-tbody
    > tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected)
    > td {
    background: ${props => props.shadowColor};
  }
  .ant-table-row-expand-icon:focus,
  .ant-table-row-expand-icon:hover {
    color: ${props => props.hoverColor};
  }
  .ant-timeline-item-head-blue {
    color: ${props => props.color};
    border-color: ${props => props.color};
  }
  .ant-select-tree-checkbox-wrapper:hover .ant-select-tree-checkbox-inner,
  .ant-select-tree-checkbox:hover .ant-select-tree-checkbox-inner,
  .ant-select-tree-checkbox-input:focus + .ant-select-tree-checkbox-inner {
    border-color: ${props => props.color};
  }
  .ant-select-tree-checkbox-checked::after {
    border: 1px solid ${props => props.color};
  }
  .ant-select-tree-checkbox-checked .ant-select-tree-checkbox-inner {
    background-color: ${props => props.color};
    border-color: ${props => props.color};
  }
  .ant-select-tree-checkbox-indeterminate
    .ant-select-tree-checkbox-inner::after {
    background-color: ${props => props.color};
  }
  .ant-select-tree
    li
    span.ant-select-icon_loading
    .ant-select-switcher-loading-icon {
    color: ${props => props.color};
  }
  .ant-select-tree
    li
    span.ant-select-tree-switcher.ant-select-tree-switcher_open
    .ant-select-switcher-loading-icon,
  .ant-select-tree
    li
    span.ant-select-tree-switcher.ant-select-tree-switcher_close
    .ant-select-switcher-loading-icon {
    color: ${props => props.color};
  }
  .ant-select-tree li .ant-select-tree-node-content-wrapper:hover {
    background-color: ${props => props.shadowColor};
  }
  .ant-select-tree
    li
    .ant-select-tree-node-content-wrapper.ant-select-tree-node-selected {
    background-color: ${props => props.shadowColor};
  }
  .ant-tree.ant-tree-directory
    > li.ant-tree-treenode-selected
    > span.ant-tree-checkbox
    .ant-tree-checkbox-inner,
  .ant-tree.ant-tree-directory
    .ant-tree-child-tree
    > li.ant-tree-treenode-selected
    > span.ant-tree-checkbox
    .ant-tree-checkbox-inner {
    border-color: ${props => props.color};
  }
  .ant-tree.ant-tree-directory
    > li.ant-tree-treenode-selected
    > span.ant-tree-checkbox.ant-tree-checkbox-checked
    .ant-tree-checkbox-inner::after,
  .ant-tree.ant-tree-directory
    .ant-tree-child-tree
    > li.ant-tree-treenode-selected
    > span.ant-tree-checkbox.ant-tree-checkbox-checked
    .ant-tree-checkbox-inner::after {
    border-color: ${props => props.color};
  }
  .ant-tree.ant-tree-directory
    > li.ant-tree-treenode-selected
    > span.ant-tree-node-content-wrapper::before,
  .ant-tree.ant-tree-directory
    .ant-tree-child-tree
    > li.ant-tree-treenode-selected
    > span.ant-tree-node-content-wrapper::before {
    background: ${props => props.color};
  }
  .ant-tree-checkbox-wrapper:hover .ant-tree-checkbox-inner,
  .ant-tree-checkbox:hover .ant-tree-checkbox-inner,
  .ant-tree-checkbox-input:focus + .ant-tree-checkbox-inner {
    border-color: ${props => props.color};
  }
  .ant-tree-checkbox-checked::after {
    border: 1px solid ${props => props.color};
  }
  .ant-tree-checkbox-checked .ant-tree-checkbox-inner {
    background-color: ${props => props.color};
    border-color: ${props => props.color};
  }
  .ant-tree-checkbox-indeterminate .ant-tree-checkbox-inner::after {
    background-color: ${props => props.color};
  }
  .ant-tree li.drag-over > span[draggable] {
    background-color: ${props => props.color};
  }
  .ant-tree li.drag-over-gap-top > span[draggable] {
    border-top-color: ${props => props.color};
  }
  .ant-tree li.drag-over-gap-bottom > span[draggable] {
    border-bottom-color: ${props => props.color};
  }
  .ant-tree
    li.ant-tree-treenode-loading
    span.ant-tree-switcher.ant-tree-switcher_open
    .ant-tree-switcher-loading-icon,
  .ant-tree
    li.ant-tree-treenode-loading
    span.ant-tree-switcher.ant-tree-switcher_close
    .ant-tree-switcher-loading-icon {
    color: ${props => props.color};
  }
  .ant-tree.ant-tree-directory
    > li
    span.ant-tree-node-content-wrapper:hover::before,
  .ant-tree.ant-tree-directory
    .ant-tree-child-tree
    > li
    span.ant-tree-node-content-wrapper:hover::before {
    background: ${props => props.shadowColor};
  }
  .ant-tree li .ant-tree-node-content-wrapper:hover {
    background-color: ${props => props.shadowColor};
  }
  .ant-tree li .ant-tree-node-content-wrapper.ant-tree-node-selected {
    background-color: ${props => props.shadowColor};
  }
  .ant-typography a {
    color: ${props => props.color};
  }
  .ant-typography a:focus,
  .ant-typography a:hover {
    color: ${props => props.hoverColor};
  }
  .ant-typography a:active {
    color: ${props => props.activeColor};
  }
  .ant-typography-expand,
  .ant-typography-edit,
  .ant-typography-copy {
    color: ${props => props.color};
  }
  .ant-typography-expand:focus,
  .ant-typography-edit:focus,
  .ant-typography-copy:focus,
  .ant-typography-expand:hover,
  .ant-typography-edit:hover,
  .ant-typography-copy:hover {
    color: ${props => props.hoverColor};
  }
  .ant-typography-expand:active,
  .ant-typography-edit:active,
  .ant-typography-copy:active {
    color: ${props => props.activeColor};
  }
  .ant-upload.ant-upload-select-picture-card:hover {
    border-color: ${props => props.color};
  }
  .ant-upload.ant-upload-drag.ant-upload-drag-hover:not(.ant-upload-disabled) {
    border-color: ${props => props.activeColor};
  }
  .ant-upload.ant-upload-drag:not(.ant-upload-disabled):hover {
    border-color: ${props => props.hoverColor};
  }
  .ant-upload.ant-upload-drag p.ant-upload-drag-icon .anticon {
    color: ${props => props.hoverColor};
  }
`;

export const BrandColorWrapper = withTheme(
  ({ theme, brandColor }: { theme: BlocksTheme; brandColor: string }) => {
    if (!brandColor) {
      return null;
    }
    const color = brandColor;
    const hoverColor = getHoverColor(brandColor);
    const activeColor = getActiveColor(brandColor);
    const shadowColor = getShadowColor(brandColor);
    const dangerColor = theme.colors.danger;

    return (
      <StyleHolder
        color={color}
        hoverColor={hoverColor}
        activeColor={activeColor}
        shadowColor={shadowColor}
        dangerColor={dangerColor}
      />
    );
  },
);
