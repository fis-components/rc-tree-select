'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _rcUtil = require('rc-util');

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _rcAnimate = require('rc-animate');

var _rcAnimate2 = _interopRequireDefault(_rcAnimate);

var _util = require('./util');

var _SelectTrigger = require('./SelectTrigger');

var _SelectTrigger2 = _interopRequireDefault(_SelectTrigger);

var _TreeNode2 = require('./TreeNode');

var _TreeNode3 = _interopRequireDefault(_TreeNode2);

function noop() {}

function filterFn(input, child) {
  return String((0, _util.getPropValue)(child, this.props.treeNodeFilterProp)).indexOf(input) > -1;
}

function saveRef(name, component) {
  this[name] = component;
}

function loopTreeData(data) {
  var level = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

  return data.map(function (item, index) {
    var pos = level + '-' + index;
    var props = {
      title: item.label,
      value: item.value,
      key: item.key || item.value || pos
    };
    var ret = undefined;
    if (item.children && item.children.length) {
      ret = _react2['default'].createElement(
        _TreeNode3['default'],
        props,
        loopTreeData(item.children, pos)
      );
    } else {
      ret = _react2['default'].createElement(_TreeNode3['default'], _extends({}, props, { isLeaf: item.isLeaf }));
    }
    return ret;
  });
}

var SHOW_ALL = 'SHOW_ALL';
var SHOW_PARENT = 'SHOW_PARENT';
var SHOW_CHILD = 'SHOW_CHILD';

var Select = _react2['default'].createClass({
  displayName: 'Select',

  propTypes: {
    children: _react.PropTypes.any,
    multiple: _react.PropTypes.bool,
    filterTreeNode: _react.PropTypes.any,
    showSearch: _react.PropTypes.bool,
    disabled: _react.PropTypes.bool,
    showArrow: _react.PropTypes.bool,
    tags: _react.PropTypes.bool,
    transitionName: _react.PropTypes.string,
    animation: _react.PropTypes.string,
    choiceTransitionName: _react.PropTypes.string,
    onClick: _react.PropTypes.func,
    onChange: _react.PropTypes.func,
    onSelect: _react.PropTypes.func,
    onSearch: _react.PropTypes.func,
    searchPlaceholder: _react.PropTypes.string,
    placeholder: _react.PropTypes.any,
    value: _react.PropTypes.oneOfType([_react.PropTypes.array, _react.PropTypes.string]),
    defaultValue: _react.PropTypes.oneOfType([_react.PropTypes.array, _react.PropTypes.string]),
    label: _react.PropTypes.oneOfType([_react.PropTypes.array, _react.PropTypes.any]),
    defaultLabel: _react.PropTypes.oneOfType([_react.PropTypes.array, _react.PropTypes.any]),
    dropdownStyle: _react.PropTypes.object,
    drodownPopupAlign: _react.PropTypes.object,
    maxTagTextLength: _react.PropTypes.number,
    showCheckedStrategy: _react.PropTypes.oneOf([SHOW_ALL, SHOW_PARENT, SHOW_CHILD]),
    skipHandleInitValue: _react.PropTypes.bool,
    treeIcon: _react.PropTypes.bool,
    treeLine: _react.PropTypes.bool,
    treeDefaultExpandAll: _react.PropTypes.bool,
    treeCheckable: _react.PropTypes.oneOfType([_react.PropTypes.bool, _react.PropTypes.node]),
    treeNodeLabelProp: _react.PropTypes.string,
    treeNodeFilterProp: _react.PropTypes.string,
    treeData: _react.PropTypes.array,
    loadData: _react.PropTypes.func
  },

  getDefaultProps: function getDefaultProps() {
    return {
      prefixCls: 'rc-tree-select',
      filterTreeNode: filterFn,
      showSearch: true,
      allowClear: false,
      placeholder: '',
      searchPlaceholder: '',
      defaultValue: [],
      onClick: noop,
      onChange: noop,
      onSelect: noop,
      onSearch: noop,
      showArrow: true,
      dropdownMatchSelectWidth: true,
      dropdownStyle: {},
      notFoundContent: 'Not Found',
      showCheckedStrategy: SHOW_CHILD,
      skipHandleInitValue: false,
      treeIcon: false,
      treeLine: false,
      treeDefaultExpandAll: false,
      treeCheckable: false,
      treeNodeFilterProp: 'value',
      treeNodeLabelProp: 'title'
    };
  },

  getInitialState: function getInitialState() {
    var props = this.props;
    var value = [];
    if ('value' in props) {
      value = (0, _util.toArray)(props.value);
    } else {
      value = (0, _util.toArray)(props.defaultValue);
    }
    if (props.treeCheckable && !props.skipHandleInitValue) {
      value = this.getValue((0, _util.getTreeNodesStates)(this.renderTreeData() || props.children, value).checkedTreeNodes);
    }
    var label = this.getLabelFromProps(props, value, 1);
    var inputValue = '';
    if (props.combobox) {
      inputValue = value[0] || '';
    }
    this.saveInputRef = saveRef.bind(this, 'inputInstance');
    return { value: value, inputValue: inputValue, label: label };
  },

  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      var value = (0, _util.toArray)(nextProps.value);
      if (nextProps.treeCheckable && !nextProps.skipHandleInitValue) {
        value = this.getValue((0, _util.getTreeNodesStates)(this.renderTreeData(nextProps) || nextProps.children, value).checkedTreeNodes);
      }
      var label = this.getLabelFromProps(nextProps, value);
      this.setState({
        value: value,
        label: label
      });
      if (nextProps.combobox) {
        this.setState({
          inputValue: value[0] || ''
        });
      }
    }
  },

  componentDidUpdate: function componentDidUpdate() {
    var state = this.state;
    var props = this.props;
    if (state.open && (0, _util.isMultipleOrTags)(props)) {
      var inputNode = this.getInputDOMNode();
      if (inputNode.value) {
        inputNode.style.width = '';
        inputNode.style.width = inputNode.scrollWidth + 'px';
      } else {
        inputNode.style.width = '';
      }
    }
  },

  componentWillUnmount: function componentWillUnmount() {
    if (this.dropdownContainer) {
      _reactDom2['default'].unmountComponentAtNode(this.dropdownContainer);
      document.body.removeChild(this.dropdownContainer);
      this.dropdownContainer = null;
    }
  },

  onInputChange: function onInputChange(event) {
    var val = event.target.value;
    var props = this.props;
    this.setState({
      inputValue: val,
      open: true
    });
    if ((0, _util.isCombobox)(props)) {
      this.fireChange([val], [val]);
    }
    props.onSearch(val);
  },

  onDropdownVisibleChange: function onDropdownVisibleChange(open) {
    this.setOpenState(open);
  },

  // combobox ignore
  onKeyDown: function onKeyDown(event) {
    var props = this.props;
    if (props.disabled) {
      return;
    }
    var keyCode = event.keyCode;
    if (this.state.open && !this.getInputDOMNode()) {
      this.onInputKeyDown(event);
    } else if (keyCode === _rcUtil.KeyCode.ENTER || keyCode === _rcUtil.KeyCode.DOWN) {
      this.setOpenState(true);
      event.preventDefault();
    }
  },

  onInputKeyDown: function onInputKeyDown(event) {
    var props = this.props;
    var state = this.state;
    var keyCode = event.keyCode;
    if ((0, _util.isMultipleOrTags)(props) && !event.target.value && keyCode === _rcUtil.KeyCode.BACKSPACE) {
      var value = state.value.concat();
      if (value.length) {
        var label = state.label.concat();
        value.pop();
        label.pop();
        this.fireChange(value, label);
      }
      return;
    }

    if (keyCode === _rcUtil.KeyCode.DOWN) {
      if (!state.open) {
        this.openIfHasChildren();
        event.preventDefault();
        event.stopPropagation();
        return;
      }
    } else if (keyCode === _rcUtil.KeyCode.ESC) {
      if (state.open) {
        this.setOpenState(false);
        event.preventDefault();
        event.stopPropagation();
      }
      return;
    }

    if (state.open) {
      // const menu = this.refs.trigger.getPopupEleRefs();
      // if (menu && menu.onKeyDown(event)) {
      //   event.preventDefault();
      //   event.stopPropagation();
      // }
    }
  },

  onSelect: function onSelect(selectedKeys, info) {
    var _this = this;

    var checkEvt = info.event === 'check';
    if (info.selected === false) {
      this.onDeselect(info);
      return;
    }
    var item = info.node;
    var value = this.state.value;
    var label = this.state.label;
    var props = this.props;
    var selectedValue = (0, _util.getValuePropValue)(item);
    var selectedLabel = this.getLabelFromNode(item);
    props.onSelect(selectedValue, item);
    if ((0, _util.isMultipleOrTags)(props)) {
      if (checkEvt) {
        // TODO treeCheckable does not support tags/dynamic
        var checkedNodes = info.checkedNodes;

        var checkedNodesPositions = info.checkedNodesPositions;
        if (props.showCheckedStrategy === SHOW_ALL) {
          checkedNodes = checkedNodes;
        } else if (props.showCheckedStrategy === SHOW_PARENT) {
          (function () {
            var posArr = (0, _util.filterParentPosition)(checkedNodesPositions.map(function (itemObj) {
              return itemObj.pos;
            }));
            checkedNodes = checkedNodesPositions.filter(function (itemObj) {
              return posArr.indexOf(itemObj.pos) !== -1;
            }).map(function (itemObj) {
              return itemObj.node;
            });
          })();
        } else {
          checkedNodes = checkedNodes.filter(function (n) {
            return !n.props.children;
          });
        }
        value = checkedNodes.map(function (n) {
          return (0, _util.getValuePropValue)(n);
        });
        label = checkedNodes.map(function (n) {
          return _this.getLabelFromNode(n);
        });
      } else {
        if (value.indexOf(selectedValue) !== -1) {
          return;
        }
        value = value.concat([selectedValue]);
        label = label.concat([selectedLabel]);
      }
      if (!checkEvt && value.indexOf(selectedValue) !== -1) {
        // 设置 multiple 时会有bug。（isValueChange 已有检查，此处注释掉）
        // return;
      }
    } else {
        if (value[0] === selectedValue) {
          this.setOpenState(false);
          return;
        }
        value = [selectedValue];
        label = [selectedLabel];
        this.setOpenState(false);
      }

    var extraInfo = {
      triggerValue: selectedValue,
      triggerNode: item
    };
    if (checkEvt) {
      extraInfo.checked = info.checked;
      // extraInfo.allCheckedNodes = info.checkedNodes;
      extraInfo.allCheckedNodes = (0, _util.flatToHierarchy)(info.checkedNodesPositions);
    } else {
      extraInfo.selected = info.selected;
    }

    this.fireChange(value, label, extraInfo);
    this.setState({
      inputValue: ''
    });
    if ((0, _util.isCombobox)(props)) {
      this.setState({
        inputValue: (0, _util.getPropValue)(item, props.treeNodeLabelProp)
      });
    }
  },

  onDeselect: function onDeselect(info) {
    this.removeSelected((0, _util.getValuePropValue)(info.node));
    if (!(0, _util.isMultipleOrTags)(this.props)) {
      this.setOpenState(false);
    }
    this.setState({
      inputValue: ''
    });
  },

  onPlaceholderClick: function onPlaceholderClick() {
    this.getInputDOMNode().focus();
  },

  onClearSelection: function onClearSelection(event) {
    var props = this.props;
    var state = this.state;
    if (props.disabled) {
      return;
    }
    event.stopPropagation();
    if (state.inputValue || state.value.length) {
      this.fireChange([], []);
      this.setOpenState(false);
      this.setState({
        inputValue: ''
      });
    }
  },

  getLabelBySingleValue: function getLabelBySingleValue(children, value) {
    var _this2 = this;

    if (value === undefined) {
      return null;
    }
    var label = null;
    var loop = function loop(childs) {
      _react2['default'].Children.forEach(childs, function (item) {
        if (item.props.children) {
          loop(item.props.children);
        }
        if ((0, _util.getValuePropValue)(item) === value) {
          label = _this2.getLabelFromNode(item);
        }
      });
    };
    loop(children, 0);
    return label;
  },

  getLabelFromNode: function getLabelFromNode(child) {
    return (0, _util.getPropValue)(child, this.props.treeNodeLabelProp);
  },

  getLabelFromProps: function getLabelFromProps(props, value, init) {
    var label = [];
    if ('label' in props) {
      label = (0, _util.toArray)(props.label);
    } else if (init && 'defaultLabel' in props) {
      label = (0, _util.toArray)(props.defaultLabel);
    } else {
      label = this.getLabelByValue(this.renderTreeData(props) || props.children, value);
    }
    return label;
  },

  getVLForOnChange: function getVLForOnChange(vls) {
    if (vls !== undefined) {
      return (0, _util.isMultipleOrTags)(this.props) ? vls : vls[0];
    }
    return vls;
  },

  getLabelByValue: function getLabelByValue(children, values) {
    var _this3 = this;

    return values.map(function (value) {
      var label = _this3.getLabelBySingleValue(children, value);
      if (label === null) {
        return value;
      }
      return label;
    });
  },

  getDropdownContainer: function getDropdownContainer() {
    if (!this.dropdownContainer) {
      this.dropdownContainer = document.createElement('div');
      document.body.appendChild(this.dropdownContainer);
    }
    return this.dropdownContainer;
  },

  getSearchPlaceholderElement: function getSearchPlaceholderElement(hidden) {
    var props = this.props;
    if (props.searchPlaceholder) {
      return _react2['default'].createElement(
        'span',
        {
          style: { display: hidden ? 'none' : 'block' },
          onClick: this.onPlaceholderClick,
          className: props.prefixCls + '-search__field__placeholder' },
        props.searchPlaceholder
      );
    }
    return null;
  },

  getInputElement: function getInputElement() {
    var props = this.props;
    return _react2['default'].createElement(
      'span',
      { className: props.prefixCls + '-search__field__wrap' },
      _react2['default'].createElement('input', { ref: this.saveInputRef,
        onChange: this.onInputChange,
        onKeyDown: this.onInputKeyDown,
        value: this.state.inputValue,
        disabled: props.disabled,
        className: props.prefixCls + '-search__field',
        role: 'textbox' }),
      (0, _util.isMultipleOrTags)(props) ? null : this.getSearchPlaceholderElement(!!this.state.inputValue)
    );
  },

  getInputDOMNode: function getInputDOMNode() {
    return this.inputInstance;
  },

  getPopupDOMNode: function getPopupDOMNode() {
    return this.refs.trigger.getPopupDOMNode();
  },

  getPopupComponentRefs: function getPopupComponentRefs() {
    return this.refs.trigger.getPopupEleRefs();
  },

  getValue: function getValue(checkedTreeNodes) {
    this.checkedTreeNodes = checkedTreeNodes;
    var mapVal = function mapVal(arr) {
      return arr.map(function (itemObj) {
        return (0, _util.getValuePropValue)(itemObj.node);
      });
    };
    var props = this.props;
    var checkedValues = [];
    if (props.showCheckedStrategy === SHOW_ALL) {
      checkedValues = mapVal(checkedTreeNodes);
    } else if (props.showCheckedStrategy === SHOW_PARENT) {
      (function () {
        var posArr = (0, _util.filterParentPosition)(checkedTreeNodes.map(function (itemObj) {
          return itemObj.pos;
        }));
        checkedValues = mapVal(checkedTreeNodes.filter(function (itemObj) {
          return posArr.indexOf(itemObj.pos) !== -1;
        }));
      })();
    } else {
      checkedValues = mapVal(checkedTreeNodes.filter(function (itemObj) {
        return !itemObj.node.props.children;
      }));
    }
    return checkedValues;
  },

  getDeselectedValue: function getDeselectedValue(selectedValue) {
    var checkedTreeNodes = this.checkedTreeNodes;
    var unCheckPos = undefined;
    checkedTreeNodes.forEach(function (itemObj) {
      if (itemObj.node.props.value === selectedValue) {
        unCheckPos = itemObj.pos;
      }
    });
    var nArr = unCheckPos.split('-');
    var newVals = [];
    checkedTreeNodes.forEach(function (itemObj) {
      var iArr = itemObj.pos.split('-');
      if (itemObj.pos === unCheckPos || nArr.length > iArr.length && (0, _util.isInclude)(iArr, nArr) || nArr.length < iArr.length && (0, _util.isInclude)(nArr, iArr)) {
        // 过滤掉 父级节点 和 所有子节点。
        // 因为 node节点 不选时，其 父级节点 和 所有子节点 都不选。
        return;
      }
      newVals.push(itemObj.node.props.value);
    });
    var label = this.state.label.concat();
    this.state.value.forEach(function (val, index) {
      if (newVals.indexOf(val) === -1) {
        label.splice(index, 1);
      }
    });
    this.fireChange(newVals, label, { triggerValue: selectedValue, clear: true });
  },

  setOpenState: function setOpenState(open) {
    var _this4 = this;

    var refs = this.refs;
    this.setState({
      open: open
    }, function () {
      if (open || (0, _util.isMultipleOrTagsOrCombobox)(_this4.props)) {
        if (_this4.getInputDOMNode()) {
          _this4.getInputDOMNode().focus();
        }
      } else if (refs.selection) {
        refs.selection.focus();
      }
    });
  },

  removeSelected: function removeSelected(selectedValue, e) {
    var props = this.props;
    if (props.disabled) {
      return;
    }
    if (e) {
      e.stopPropagation();
    }
    if ((props.showCheckedStrategy === SHOW_ALL || props.showCheckedStrategy === SHOW_PARENT) && !props.skipHandleInitValue) {
      this.getDeselectedValue(selectedValue);
      return;
    }
    var label = this.state.label.concat();
    var index = this.state.value.indexOf(selectedValue);
    var value = this.state.value.filter(function (singleValue) {
      return singleValue !== selectedValue;
    });
    if (index !== -1) {
      label.splice(index, 1);
    }
    this.fireChange(value, label, { triggerValue: selectedValue, clear: true });
  },

  openIfHasChildren: function openIfHasChildren() {
    var props = this.props;
    if (_react2['default'].Children.count(props.children) || (0, _util.isSingleMode)(props)) {
      this.setOpenState(true);
    }
  },

  isValueChange: function isValueChange(value) {
    var sv = this.state.value;
    if (typeof sv === 'string') {
      sv = [sv];
    }
    if (value.length !== sv.length || !value.every(function (val, index) {
      return sv[index] === val;
    })) {
      return true;
    }
  },

  fireChange: function fireChange(value, label, extraInfo) {
    var props = this.props;
    if (!('value' in props)) {
      this.setState({
        value: value, label: label
      });
    }
    if (this.isValueChange(value)) {
      var ex = { preValue: [].concat(_toConsumableArray(this.state.value)) };
      if (extraInfo) {
        (0, _objectAssign2['default'])(ex, extraInfo);
      }
      props.onChange(this.getVLForOnChange(value), this.getVLForOnChange(label), ex);
    }
  },
  renderTopControlNode: function renderTopControlNode() {
    var _this5 = this;

    var value = this.state.value;
    var label = this.state.label;
    var props = this.props;
    var choiceTransitionName = props.choiceTransitionName;
    var prefixCls = props.prefixCls;
    var maxTagTextLength = props.maxTagTextLength;

    // single and not combobox, input is inside dropdown
    if ((0, _util.isSingleMode)(props)) {
      var placeholder = _react2['default'].createElement(
        'span',
        { key: 'placeholder',
          className: prefixCls + '-selection__placeholder' },
        props.placeholder
      );
      var innerNode = placeholder;
      if (this.state.label[0]) {
        innerNode = _react2['default'].createElement(
          'span',
          { key: 'value' },
          this.state.label[0]
        );
      }
      return _react2['default'].createElement(
        'span',
        { className: prefixCls + '-selection__rendered' },
        innerNode
      );
    }

    var selectedValueNodes = [];
    if ((0, _util.isMultipleOrTags)(props)) {
      selectedValueNodes = value.map(function (singleValue, index) {
        var content = label[index];
        var title = content;
        if (maxTagTextLength && typeof content === 'string' && content.length > maxTagTextLength) {
          content = content.slice(0, maxTagTextLength) + '...';
        }
        return _react2['default'].createElement(
          'li',
          { className: prefixCls + '-selection__choice',
            key: singleValue,
            title: title },
          _react2['default'].createElement(
            'span',
            { className: prefixCls + '-selection__choice__content' },
            content
          ),
          _react2['default'].createElement('span', { className: prefixCls + '-selection__choice__remove',
            onClick: _this5.removeSelected.bind(_this5, singleValue) })
        );
      });
    }
    selectedValueNodes.push(_react2['default'].createElement(
      'li',
      { className: prefixCls + '-search ' + prefixCls + '-search--inline', key: '__input' },
      this.getInputElement()
    ));
    var className = prefixCls + '-selection__rendered';
    if ((0, _util.isMultipleOrTags)(props) && choiceTransitionName) {
      return _react2['default'].createElement(
        _rcAnimate2['default'],
        { className: className,
          component: 'ul',
          transitionName: choiceTransitionName },
        selectedValueNodes
      );
    }
    return _react2['default'].createElement(
      'ul',
      { className: className },
      selectedValueNodes
    );
  },
  renderTreeData: function renderTreeData(props) {
    var validProps = props || this.props;
    if (validProps.treeData) {
      return loopTreeData(validProps.treeData);
    }
  },
  render: function render() {
    var _rootCls;

    var props = this.props;
    var multiple = (0, _util.isMultipleOrTags)(props);
    var state = this.state;
    var className = props.className;
    var disabled = props.disabled;
    var allowClear = props.allowClear;
    var prefixCls = props.prefixCls;

    var ctrlNode = this.renderTopControlNode();
    var extraSelectionProps = {};
    if (!(0, _util.isCombobox)(props)) {
      extraSelectionProps = {
        onKeyDown: this.onKeyDown,
        tabIndex: 0
      };
    }
    var rootCls = (_rootCls = {}, _defineProperty(_rootCls, className, !!className), _defineProperty(_rootCls, prefixCls, 1), _defineProperty(_rootCls, prefixCls + '-open', state.open), _defineProperty(_rootCls, prefixCls + '-combobox', (0, _util.isCombobox)(props)), _defineProperty(_rootCls, prefixCls + '-disabled', disabled), _defineProperty(_rootCls, prefixCls + '-enabled', !disabled), _rootCls);

    var clear = _react2['default'].createElement('span', { key: 'clear',
      className: prefixCls + '-selection__clear',
      onClick: this.onClearSelection });
    return _react2['default'].createElement(
      _SelectTrigger2['default'],
      _extends({}, props, {
        treeNodes: props.children,
        treeData: this.renderTreeData(),
        multiple: multiple,
        disabled: disabled,
        visible: state.open,
        inputValue: state.inputValue,
        inputElement: this.getInputElement(),
        value: state.value,
        onDropdownVisibleChange: this.onDropdownVisibleChange,
        onSelect: this.onSelect,
        ref: 'trigger' }),
      _react2['default'].createElement(
        'span',
        {
          style: props.style,
          onClick: props.onClick,
          className: (0, _classnames2['default'])(rootCls) },
        _react2['default'].createElement(
          'span',
          _extends({ ref: 'selection',
            key: 'selection',
            className: prefixCls + '-selection ' + prefixCls + '-selection--' + (multiple ? 'multiple' : 'single'),
            role: 'combobox',
            'aria-autocomplete': 'list',
            'aria-haspopup': 'true',
            'aria-expanded': state.open
          }, extraSelectionProps),
          ctrlNode,
          allowClear && !(0, _util.isMultipleOrTags)(props) ? clear : null,
          multiple || !props.showArrow ? null : _react2['default'].createElement(
            'span',
            { key: 'arrow', className: prefixCls + '-arrow', tabIndex: '-1', style: { outline: 'none' } },
            _react2['default'].createElement('b', null)
          ),
          multiple ? this.getSearchPlaceholderElement(!!this.state.inputValue || this.state.value.length) : null
        )
      )
    );
  }
});

Select.SHOW_ALL = SHOW_ALL;
Select.SHOW_PARENT = SHOW_PARENT;
Select.SHOW_CHILD = SHOW_CHILD;

exports['default'] = Select;
module.exports = exports['default'];