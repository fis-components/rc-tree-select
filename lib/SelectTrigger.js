'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _rcTrigger = require('rc-trigger');

var _rcTrigger2 = _interopRequireDefault(_rcTrigger);

var _rcTree = require('rc-tree');

var _rcTree2 = _interopRequireDefault(_rcTree);

var _util = require('./util');

var BUILT_IN_PLACEMENTS = {
  bottomLeft: {
    points: ['tl', 'bl'],
    offset: [0, 4],
    overflow: {
      adjustX: 0,
      adjustY: 1
    }
  },
  topLeft: {
    points: ['bl', 'tl'],
    offset: [0, -4],
    overflow: {
      adjustX: 0,
      adjustY: 1
    }
  }
};

var SelectTrigger = _react2['default'].createClass({
  displayName: 'SelectTrigger',

  propTypes: {
    dropdownMatchSelectWidth: _react.PropTypes.bool,
    visible: _react.PropTypes.bool,
    filterTreeNode: _react.PropTypes.any,
    treeNodes: _react.PropTypes.any,
    prefixCls: _react.PropTypes.string,
    popupClassName: _react.PropTypes.string,
    children: _react.PropTypes.any
  },

  componentDidUpdate: function componentDidUpdate() {
    if (this.props.dropdownMatchSelectWidth && this.props.visible) {
      var dropdownDOMNode = this.getPopupDOMNode();
      if (dropdownDOMNode) {
        dropdownDOMNode.style.width = _reactDom2['default'].findDOMNode(this).offsetWidth + 'px';
      }
    }
  },

  getPopupEleRefs: function getPopupEleRefs() {
    return this.popupEle && this.popupEle.refs;
  },

  getPopupDOMNode: function getPopupDOMNode() {
    return this.refs.trigger.getPopupDomNode();
  },

  getDropdownTransitionName: function getDropdownTransitionName() {
    var props = this.props;
    var transitionName = props.transitionName;
    if (!transitionName && props.animation) {
      transitionName = this.getDropdownPrefixCls() + '-' + props.animation;
    }
    return transitionName;
  },

  getDropdownPrefixCls: function getDropdownPrefixCls() {
    return this.props.prefixCls + '-dropdown';
  },

  filterTree: function filterTree(treeNode) {
    var props = this.props;
    return props.inputValue && treeNode.props[props.treeNodeFilterProp].indexOf(props.inputValue) > -1;
  },

  filterTreeNode: function filterTreeNode(input, child) {
    if (!input) {
      return true;
    }
    var filterTreeNode = this.props.filterTreeNode;
    if (!filterTreeNode) {
      return true;
    }
    if (child.props.disabled) {
      return false;
    }
    return filterTreeNode.call(this, input, child);
  },

  savePopupElement: function savePopupElement(ele) {
    this.popupEle = ele;
  },

  renderFilterOptionsFromChildren: function renderFilterOptionsFromChildren(children) {
    var _this = this;

    var posArr = [];
    var filterPos = [];
    var props = this.props;
    var inputValue = props.inputValue;

    (0, _util.loopAllChildren)(children, function (child, index, pos) {
      if (_this.filterTreeNode(inputValue, child)) {
        posArr.push(pos);
      }
    });
    posArr = (0, _util.filterMinPos)(posArr);

    var filterChildren = {};
    (0, _util.loopAllChildren)(children, function (child, index, pos) {
      posArr.forEach(function (item) {
        if (item.indexOf(pos) === 0 && filterPos.indexOf(pos) === -1) {
          filterPos.push(pos);
          filterChildren[pos] = child;
        }
      });
    });

    var level = {};
    filterPos.forEach(function (pos) {
      var arr = pos.split('-');
      var key = String(arr.length - 1);
      level[key] = level[key] || [];
      level[key].push(pos);
    });

    var childrenArr = [];

    function loop(arr, cur, callback) {
      arr.forEach(function (c, index) {
        if (cur.indexOf(c.pos) === 0) {
          if (c.children) {
            if (cur.split('-').length === c.pos.split('-').length + 1) {
              callback(arr, index);
            } else {
              loop(c.children, cur, callback);
            }
          } else {
            callback(arr, index);
          }
        }
      });
    }
    var levelArr = Object.keys(level).sort(function (a, b) {
      return a - b;
    });
    if (levelArr.length > 0) {
      level[levelArr[0]].forEach(function (pos, index) {
        childrenArr[index] = {
          pos: pos,
          node: filterChildren[pos]
        };
      });
      var loopFn = function loopFn(cur) {
        loop(childrenArr, cur, function (arr, index) {
          arr[index].children = arr[index].children || [];
          arr[index].children.push({
            pos: cur,
            node: filterChildren[cur]
          });
        });
      };
      for (var i = 1; i < levelArr.length; i++) {
        level[levelArr[i]].forEach(loopFn);
      }
    }
    return childrenArr;
  },

  renderTree: function renderTree(treeNodes, newTreeNodes, multiple) {
    var props = this.props;

    var loop = function loop(data) {
      return data.map(function (item) {
        var tProps = { key: item.node.key };
        (0, _objectAssign2['default'])(tProps, item.node.props);
        if (tProps.children) {
          delete tProps.children;
        }
        if (item.children) {
          return _react2['default'].createElement(
            _rcTree.TreeNode,
            tProps,
            loop(item.children)
          );
        }
        return _react2['default'].createElement(_rcTree.TreeNode, tProps);
      });
    };

    var trProps = {
      multiple: multiple,
      prefixCls: props.prefixCls + '-tree',
      showIcon: props.treeIcon,
      showLine: props.treeLine,
      defaultExpandAll: props.treeDefaultExpandAll,
      checkable: props.treeCheckable,
      filterTreeNode: this.filterTree
    };
    var vals = props.value || props.defaultValue;
    var keys = [];
    (0, _util.loopAllChildren)(treeNodes, function (child) {
      if (vals.indexOf((0, _util.getValuePropValue)(child)) > -1) {
        keys.push(child.key);
      }
    });
    // 为避免混乱，checkable 模式下，select 失效
    if (trProps.checkable) {
      trProps.selectable = false;
      trProps.checkedKeys = keys;
      trProps.onCheck = props.onSelect;
    } else {
      trProps.selectedKeys = keys;
      trProps.onSelect = props.onSelect;
    }

    // async loadData
    if (props.loadData) {
      trProps.loadData = props.loadData;
    }

    return _react2['default'].createElement(
      _rcTree2['default'],
      _extends({ ref: this.savePopupElement }, trProps),
      loop(newTreeNodes)
    );
  },
  render: function render() {
    var _popupClassName;

    var props = this.props;
    var multiple = props.multiple;
    var dropdownPrefixCls = this.getDropdownPrefixCls();
    var popupClassName = (_popupClassName = {}, _defineProperty(_popupClassName, props.dropdownClassName, !!props.dropdownClassName), _defineProperty(_popupClassName, dropdownPrefixCls + '--' + (multiple ? 'multiple' : 'single'), 1), _popupClassName);
    var visible = props.visible;
    var search = multiple || props.combobox || !props.showSearch ? null : _react2['default'].createElement(
      'span',
      { className: dropdownPrefixCls + '-search' },
      props.inputElement
    );
    var treeNodes = this.renderFilterOptionsFromChildren(props.treeData || props.treeNodes);
    var notFoundContent = undefined;
    if (!treeNodes.length) {
      if (props.notFoundContent) {
        notFoundContent = _react2['default'].createElement(
          'span',
          null,
          props.notFoundContent
        );
      }
      if (!search) {
        visible = false;
      }
    }
    var popupElement = _react2['default'].createElement(
      'div',
      null,
      search,
      notFoundContent ? notFoundContent : this.renderTree(props.treeData || props.treeNodes, treeNodes, multiple)
    );

    return _react2['default'].createElement(
      _rcTrigger2['default'],
      { action: props.disabled ? [] : ['click'],
        ref: 'trigger',
        popupPlacement: 'bottomLeft',
        builtinPlacements: BUILT_IN_PLACEMENTS,
        prefixCls: dropdownPrefixCls,
        popupTransitionName: this.getDropdownTransitionName(),
        onPopupVisibleChange: props.onDropdownVisibleChange,
        popup: popupElement,
        popupVisible: visible,
        popupClassName: (0, _classnames2['default'])(popupClassName),
        popupStyle: props.dropdownStyle
      },
      this.props.children
    );
  }
});

exports['default'] = SelectTrigger;
module.exports = exports['default'];