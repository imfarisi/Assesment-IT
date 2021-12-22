
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.44.3' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src/Common/svg-netflix/Icons/NetflixIcon.svelte generated by Svelte v3.44.3 */

    const file$8 = "src/Common/svg-netflix/Icons/NetflixIcon.svelte";

    function create_fragment$8(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M11.4425 20.8714C10.216 21.0817 8.96781 21.1447 7.67665 21.3127L3.73844 10.0502V21.796C2.51186 21.9221 1.39286 22.0902 0.230774 22.2582V0.74173H3.50187L7.97788 12.95V0.74173H11.4425V20.8714ZM18.2213 8.62132C19.5556 8.62132 21.6 8.55826 22.8266 8.55826V11.9201C21.2986 11.9201 19.5125 11.9201 18.2213 11.9832V16.9842C20.2442 16.8582 22.2671 16.6899 24.3114 16.6269V19.8626L14.7781 20.5981V0.74173H24.3114V4.10369H18.2213V8.62132ZM37.1156 4.10377H33.5434V19.5687C32.3813 19.5687 31.2192 19.5687 30.1004 19.6106V4.10377H26.5281V0.74173H37.1158L37.1156 4.10377ZM42.7107 8.39025H47.4236V11.7521H42.7107V19.3797H39.3319V0.74173H48.9515V4.10369H42.7107V8.39025ZM54.5466 16.4378C56.505 16.4798 58.4847 16.6271 60.4 16.732V20.052C57.3227 19.8627 54.2454 19.6739 51.1035 19.6106V0.74173H54.5466V16.4378ZM63.3051 20.2831C64.4027 20.3462 65.5647 20.4093 66.6837 20.5352V0.74173H63.3051V20.2831ZM81.7692 0.74173L77.4006 10.9747L81.7692 22.2582C80.4779 22.0902 79.1867 21.859 77.8955 21.6488L75.4209 15.4294L72.9033 21.1447C71.6549 20.9344 70.4498 20.8714 69.2019 20.7033L73.6349 10.8485L69.6321 0.74173H73.3333L75.5929 6.39403L78.0032 0.74173H81.7692Z");
    			attr_dev(path, "fill", "white");
    			add_location(path, file$8, 18, 2, 308);
    			attr_dev(svg, "width", "82");
    			attr_dev(svg, "height", "23");
    			attr_dev(svg, "viewBox", "0 0 82 23");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg, file$8, 11, 0, 199);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('NetflixIcon', slots, []);
    	let { size = "100%" } = $$props;

    	if (size !== "100%") {
    		size = size.slice(-1) === "x"
    		? size.slice(0, size.length - 1) + "em"
    		: parseInt(size) + "px";
    	}

    	const writable_props = ['size'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<NetflixIcon> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('size' in $$props) $$invalidate(0, size = $$props.size);
    	};

    	$$self.$capture_state = () => ({ size });

    	$$self.$inject_state = $$props => {
    		if ('size' in $$props) $$invalidate(0, size = $$props.size);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [size];
    }

    class NetflixIcon extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, { size: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NetflixIcon",
    			options,
    			id: create_fragment$8.name
    		});
    	}

    	get size() {
    		throw new Error("<NetflixIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<NetflixIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Common/svg-netflix/Icons/MagnifierIcon.svelte generated by Svelte v3.44.3 */

    const file$7 = "src/Common/svg-netflix/Icons/MagnifierIcon.svelte";

    function create_fragment$7(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "fill-rule", "evenodd");
    			attr_dev(path, "d", "M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z");
    			attr_dev(path, "cdivp-rule", "evenodd");
    			add_location(path, file$7, 16, 3, 321);
    			attr_dev(svg, "class", "w-6 h-6 font-bold mx-2");
    			attr_dev(svg, "fill", "currentColor");
    			attr_dev(svg, "viewBox", "0 0 20 20");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg, file$7, 11, 0, 199);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MagnifierIcon', slots, []);
    	let { size = "100%" } = $$props;

    	if (size !== "100%") {
    		size = size.slice(-1) === "x"
    		? size.slice(0, size.length - 1) + "em"
    		: parseInt(size) + "px";
    	}

    	const writable_props = ['size'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<MagnifierIcon> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('size' in $$props) $$invalidate(0, size = $$props.size);
    	};

    	$$self.$capture_state = () => ({ size });

    	$$self.$inject_state = $$props => {
    		if ('size' in $$props) $$invalidate(0, size = $$props.size);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [size];
    }

    class MagnifierIcon extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { size: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MagnifierIcon",
    			options,
    			id: create_fragment$7.name
    		});
    	}

    	get size() {
    		throw new Error("<MagnifierIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<MagnifierIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Common/svg-netflix/Icons/ArrowDown.svelte generated by Svelte v3.44.3 */

    const file$6 = "src/Common/svg-netflix/Icons/ArrowDown.svelte";

    function create_fragment$6(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "fill-rule", "evenodd");
    			attr_dev(path, "clip-rule", "evenodd");
    			attr_dev(path, "d", "M0.146894 0.146894C0.19334 0.10033 0.248515 0.0633873 0.30926 0.0381808C0.370005 0.0129744 0.435127 0 0.500894 0C0.566661 0 0.631782 0.0129744 0.692528 0.0381808C0.753273 0.0633873 0.808448 0.10033 0.854894 0.146894L6.50089 5.79389L12.1469 0.146894C12.1934 0.100406 12.2486 0.0635292 12.3093 0.0383701C12.37 0.013211 12.4352 0.000261784 12.5009 0.000261784C12.5666 0.000261784 12.6317 0.013211 12.6925 0.0383701C12.7532 0.0635292 12.8084 0.100406 12.8549 0.146894C12.9014 0.193381 12.9383 0.248571 12.9634 0.30931C12.9886 0.370049 13.0015 0.43515 13.0015 0.500894C13.0015 0.566637 12.9886 0.631738 12.9634 0.692477C12.9383 0.753217 12.9014 0.808406 12.8549 0.854894L6.85489 6.85489C6.80845 6.90146 6.75327 6.9384 6.69253 6.96361C6.63178 6.98881 6.56666 7.00179 6.50089 7.00179C6.43513 7.00179 6.37001 6.98881 6.30926 6.96361C6.24852 6.9384 6.19334 6.90146 6.14689 6.85489L0.146894 0.854894C0.100331 0.808448 0.0633878 0.753272 0.0381813 0.692527C0.0129749 0.631782 0 0.566661 0 0.500894C0 0.435126 0.0129749 0.370005 0.0381813 0.30926C0.0633878 0.248515 0.100331 0.193339 0.146894 0.146894Z");
    			attr_dev(path, "fill", "white");
    			add_location(path, file$6, 20, 2, 360);
    			attr_dev(svg, "classs", "h-6 w-6 object-fit");
    			attr_dev(svg, "width", "14");
    			attr_dev(svg, "height", "8");
    			attr_dev(svg, "viewBox", "0 0 14 8");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "stroke", "currentColor");
    			add_location(svg, file$6, 11, 0, 199);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ArrowDown', slots, []);
    	let { size = "100%" } = $$props;

    	if (size !== "100%") {
    		size = size.slice(-1) === "x"
    		? size.slice(0, size.length - 1) + "em"
    		: parseInt(size) + "px";
    	}

    	const writable_props = ['size'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ArrowDown> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('size' in $$props) $$invalidate(0, size = $$props.size);
    	};

    	$$self.$capture_state = () => ({ size });

    	$$self.$inject_state = $$props => {
    		if ('size' in $$props) $$invalidate(0, size = $$props.size);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [size];
    }

    class ArrowDown extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { size: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ArrowDown",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get size() {
    		throw new Error("<ArrowDown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<ArrowDown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Components/Layouts/Navbar.svelte generated by Svelte v3.44.3 */
    const file$5 = "src/Components/Layouts/Navbar.svelte";

    function create_fragment$5(ctx) {
    	let div11;
    	let div10;
    	let div0;
    	let a;
    	let netflixicon;
    	let t0;
    	let div5;
    	let div4;
    	let div1;
    	let t2;
    	let div2;
    	let magnifiericon;
    	let t3;
    	let t4;
    	let div3;
    	let t6;
    	let div9;
    	let button;
    	let span;
    	let t8;
    	let div8;
    	let div6;
    	let p;
    	let t10;
    	let div7;
    	let arrowdown;
    	let current;
    	netflixicon = new NetflixIcon({ $$inline: true });
    	magnifiericon = new MagnifierIcon({ $$inline: true });
    	arrowdown = new ArrowDown({ $$inline: true });

    	const block = {
    		c: function create() {
    			div11 = element("div");
    			div10 = element("div");
    			div0 = element("div");
    			a = element("a");
    			create_component(netflixicon.$$.fragment);
    			t0 = space();
    			div5 = element("div");
    			div4 = element("div");
    			div1 = element("div");
    			div1.textContent = "All Genre";
    			t2 = space();
    			div2 = element("div");
    			create_component(magnifiericon.$$.fragment);
    			t3 = text("Search");
    			t4 = space();
    			div3 = element("div");
    			div3.textContent = "View Plans";
    			t6 = space();
    			div9 = element("div");
    			button = element("button");
    			span = element("span");
    			span.textContent = "View notifications";
    			t8 = space();
    			div8 = element("div");
    			div6 = element("div");
    			p = element("p");
    			p.textContent = "EN";
    			t10 = space();
    			div7 = element("div");
    			create_component(arrowdown.$$.fragment);
    			attr_dev(a, "href", "#");
    			attr_dev(a, "class", "flex title-font font-medium items-center text-white mb-4 md:mb-0");
    			add_location(a, file$5, 11, 6, 425);
    			add_location(div0, file$5, 10, 4, 413);
    			attr_dev(div1, "class", "mx-3");
    			add_location(div1, file$5, 19, 8, 661);
    			attr_dev(div2, "class", "mx-3 flex");
    			add_location(div2, file$5, 20, 8, 703);
    			attr_dev(div3, "class", "mx-3");
    			add_location(div3, file$5, 21, 8, 764);
    			attr_dev(div4, "class", "hidden lg:flex flex-row w-full text-base font-thin");
    			add_location(div4, file$5, 18, 6, 588);
    			add_location(div5, file$5, 17, 4, 576);
    			attr_dev(span, "class", "sr-only");
    			add_location(span, file$5, 29, 8, 1052);
    			attr_dev(p, "class", "text-white text-base");
    			add_location(p, file$5, 32, 12, 1155);
    			add_location(div6, file$5, 31, 10, 1137);
    			attr_dev(div7, "class", "mt-2 mx-2");
    			add_location(div7, file$5, 34, 10, 1221);
    			attr_dev(div8, "class", "flex");
    			add_location(div8, file$5, 30, 8, 1108);
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "text-white-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white");
    			add_location(button, file$5, 25, 6, 862);
    			attr_dev(div9, "class", "hidden lg:flex");
    			add_location(div9, file$5, 24, 4, 827);
    			attr_dev(div10, "class", "px-24 flex-wrap md:flex p-5 justify-between");
    			add_location(div10, file$5, 9, 2, 350);
    			attr_dev(div11, "class", "text-white body-font fixed top-0 bg-gradient-to-b from-black w-full z-50 ");
    			add_location(div11, file$5, 6, 0, 257);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div11, anchor);
    			append_dev(div11, div10);
    			append_dev(div10, div0);
    			append_dev(div0, a);
    			mount_component(netflixicon, a, null);
    			append_dev(div10, t0);
    			append_dev(div10, div5);
    			append_dev(div5, div4);
    			append_dev(div4, div1);
    			append_dev(div4, t2);
    			append_dev(div4, div2);
    			mount_component(magnifiericon, div2, null);
    			append_dev(div2, t3);
    			append_dev(div4, t4);
    			append_dev(div4, div3);
    			append_dev(div10, t6);
    			append_dev(div10, div9);
    			append_dev(div9, button);
    			append_dev(button, span);
    			append_dev(button, t8);
    			append_dev(button, div8);
    			append_dev(div8, div6);
    			append_dev(div6, p);
    			append_dev(div8, t10);
    			append_dev(div8, div7);
    			mount_component(arrowdown, div7, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(netflixicon.$$.fragment, local);
    			transition_in(magnifiericon.$$.fragment, local);
    			transition_in(arrowdown.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(netflixicon.$$.fragment, local);
    			transition_out(magnifiericon.$$.fragment, local);
    			transition_out(arrowdown.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div11);
    			destroy_component(netflixicon);
    			destroy_component(magnifiericon);
    			destroy_component(arrowdown);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Navbar', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Navbar> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ NetflixIcon, MagnifierIcon, ArrowDown });
    	return [];
    }

    class Navbar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Navbar",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src/Components/Main/Credits.svelte generated by Svelte v3.44.3 */

    const file$4 = "src/Components/Main/Credits.svelte";

    function create_fragment$4(ctx) {
    	let div7;
    	let div4;
    	let h30;
    	let t1;
    	let div3;
    	let div0;
    	let img;
    	let img_src_value;
    	let t2;
    	let div2;
    	let p0;
    	let t4;
    	let div1;
    	let t6;
    	let div6;
    	let h31;
    	let t8;
    	let p1;
    	let t10;
    	let div5;

    	const block = {
    		c: function create() {
    			div7 = element("div");
    			div4 = element("div");
    			h30 = element("h3");
    			h30.textContent = "Credits";
    			t1 = space();
    			div3 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t2 = space();
    			div2 = element("div");
    			p0 = element("p");
    			p0.textContent = "Darby Camp";
    			t4 = space();
    			div1 = element("div");
    			div1.textContent = "As Emily Elizabeth";
    			t6 = space();
    			div6 = element("div");
    			h31 = element("h3");
    			h31.textContent = "Production Companies";
    			t8 = space();
    			p1 = element("p");
    			p1.textContent = "Paramount";
    			t10 = space();
    			div5 = element("div");
    			div5.textContent = "US";
    			add_location(h30, file$4, 2, 4, 78);
    			attr_dev(img, "class", "object-cover object-center rounded-full w-8 h-8");
    			if (!src_url_equal(img.src, img_src_value = "https://storage.googleapis.com/donol.rumahzakat.org/images/20211208_024611.jpeg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "img-netflix");
    			add_location(img, file$4, 5, 8, 171);
    			attr_dev(div0, "class", "w-20");
    			add_location(div0, file$4, 4, 6, 144);
    			attr_dev(p0, "class", "font-medium text-lg");
    			add_location(p0, file$4, 12, 8, 425);
    			attr_dev(div1, "class", "font-thin text-xs text-gray-500");
    			add_location(div1, file$4, 13, 8, 479);
    			attr_dev(div2, "class", "w-full");
    			add_location(div2, file$4, 11, 6, 396);
    			attr_dev(div3, "class", "flex justify-between m-2");
    			add_location(div3, file$4, 3, 4, 99);
    			attr_dev(div4, "class", "w-2/5");
    			add_location(div4, file$4, 1, 2, 54);
    			add_location(h31, file$4, 18, 4, 612);
    			attr_dev(p1, "class", "font-medium text-lg");
    			add_location(p1, file$4, 19, 4, 646);
    			attr_dev(div5, "class", "font-thin text-xs text-gray-500");
    			add_location(div5, file$4, 20, 4, 695);
    			attr_dev(div6, "class", "w-3/5 m-2");
    			add_location(div6, file$4, 17, 2, 584);
    			attr_dev(div7, "class", "flex justify-between text-white px-16");
    			add_location(div7, file$4, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div7, anchor);
    			append_dev(div7, div4);
    			append_dev(div4, h30);
    			append_dev(div4, t1);
    			append_dev(div4, div3);
    			append_dev(div3, div0);
    			append_dev(div0, img);
    			append_dev(div3, t2);
    			append_dev(div3, div2);
    			append_dev(div2, p0);
    			append_dev(div2, t4);
    			append_dev(div2, div1);
    			append_dev(div7, t6);
    			append_dev(div7, div6);
    			append_dev(div6, h31);
    			append_dev(div6, t8);
    			append_dev(div6, p1);
    			append_dev(div6, t10);
    			append_dev(div6, div5);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div7);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Credits', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Credits> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Credits extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Credits",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src/Common/svg-netflix/Icons/DolbyIcon.svelte generated by Svelte v3.44.3 */

    const file$3 = "src/Common/svg-netflix/Icons/DolbyIcon.svelte";

    function create_fragment$3(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M0 0V18.9757H26.148V0H0ZM43.548 0C42.2256 0 41.2656 0.19298 40.5288 0.692895C39.7584 1.20867 39.4032 2.08116 39.4032 3.43896V6.38296C39.4032 7.75017 39.78 8.67048 40.5288 9.12878C41.1336 9.56825 42.1104 9.77238 43.548 9.77238C44.9688 9.77238 45.9888 9.57618 46.5696 9.15355C47.3184 8.66825 47.6952 7.70385 47.6952 6.38296V3.43896C47.6952 2.14533 47.3232 1.22502 46.5696 0.692895C45.9504 0.244755 44.904 0 43.548 0ZM30.0312 0.17341V9.54917H34.8504C37.2192 9.54917 38.1096 8.53522 38.1096 5.81393V3.76051C38.1096 1.17919 37.1088 0.17341 34.536 0.17341H30.0312ZM49.1808 0.17341V9.54917H54.96V7.99121H51.2184V0.17341H49.1808ZM56.0856 0.17341V9.54917H60.3264C61.6344 9.54917 62.1816 9.28559 62.436 9.10425C62.8704 8.80203 63.42 8.12028 63.42 7.05084C63.4176 5.79015 63 4.5302 60.9984 4.57702C62.5896 4.42566 62.94 3.61906 62.94 2.44954C62.94 1.41279 62.532 0.889839 62.0784 0.594052C61.692 0.343103 61.2336 0.17341 60.2784 0.17341H56.0856ZM63.6096 0.17341C63.9864 0.890087 66.6552 6.11071 66.6552 6.11096V9.54917H68.8344C68.8344 9.08369 68.8344 6.11096 68.8344 6.11096C68.8344 6.11071 71.5824 0.895785 71.976 0.17341H70.0584L67.8024 4.40386L65.6472 0.17341H63.6096ZM42.9984 1.48463C43.1616 1.47175 43.3536 1.48463 43.548 1.48463C45.1128 1.48463 45.6576 1.81659 45.6576 3.43896V6.25935C45.6576 7.92234 45.1128 8.31276 43.548 8.31276C41.988 8.31276 41.4408 7.92234 41.4408 6.25935V3.43896C41.4408 2.01923 41.8464 1.57382 42.9984 1.48463ZM58.0992 1.50916H60.0888C60.7656 1.50916 61.188 2.07943 61.188 2.84516C61.188 4.02137 60.6624 4.04812 59.1024 4.10684V5.1956C60.492 5.1899 61.5984 5.07942 61.5984 6.5809C61.5984 7.33548 61.1448 8.18915 59.9448 8.18915H58.0992V8.16388V1.50916ZM32.0688 1.53393H34.536C35.2392 1.53393 36.096 1.96077 36.096 3.48851V6.03664C36.096 7.67982 35.2392 8.0903 34.536 8.0903H32.0688V1.53393ZM3.09168 2.47406H6.06336C9.15744 2.47406 11.7437 5.66232 11.7437 9.45107C11.7444 13.3483 9.15744 16.5017 6.06336 16.5017H3.09168V2.47406ZM20.0851 2.47406H23.0808V16.5017H20.0851C16.9896 16.5017 14.4041 13.3483 14.4041 9.45107C14.4041 5.66232 16.9896 2.47406 20.0851 2.47406ZM71.136 7.7685C70.668 7.7685 70.2744 8.14802 70.2744 8.65934C70.2744 9.17461 70.668 9.54917 71.136 9.54917C71.5992 9.55017 72 9.17411 72 8.65934C72 8.14802 71.5992 7.7685 71.136 7.7685ZM71.136 7.91689C71.5272 7.91689 71.8296 8.23423 71.8296 8.65934C71.8296 9.09311 71.5272 9.40128 71.136 9.40128C70.74 9.40128 70.4424 9.09311 70.4424 8.65934C70.4424 8.23423 70.74 7.91689 71.136 7.91689ZM70.8024 8.13935V9.17882H70.968V8.73291H71.136L71.4 9.17882H71.544L71.28 8.73291C71.4264 8.71408 71.5176 8.61673 71.5176 8.43613C71.5176 8.23275 71.4216 8.13935 71.184 8.13935H70.8024ZM70.968 8.28824H71.1576C71.3352 8.28824 71.3736 8.33952 71.3736 8.43613C71.3784 8.55083 71.3232 8.60954 71.136 8.60954H70.968V8.28824ZM52.896 11.6526C52.0128 11.6526 51.3744 11.7961 50.8824 12.1721C50.3688 12.5601 50.1168 13.2051 50.1168 14.2255V16.4519C50.1168 17.4794 50.3832 18.1612 50.8824 18.5053C51.288 18.8355 51.9384 19 52.896 19C53.844 19 54.5232 18.8474 54.9096 18.5301C55.4112 18.1649 55.6752 17.4445 55.6752 16.4519V14.2255C55.6752 13.2535 55.4136 12.572 54.9096 12.1721C54.4944 11.8355 53.8008 11.6526 52.896 11.6526ZM62.364 11.8008V12.1473H62.796V13.384H63.1296V12.1473H63.5616V11.8008H62.364ZM63.732 11.8008V13.384H64.0416V12.3453L64.4016 13.137H64.5456L64.9296 12.2464L64.9512 13.384H65.2392V11.8008H64.8576L64.4712 12.6175L64.1136 11.8008H63.732ZM42.1584 11.826V18.951H43.572V14.3246L45.132 17.7881H45.8256L47.5752 13.8542L47.6232 18.951H48.9672V11.826H47.2152L45.4656 15.5613L43.86 11.826H42.1584ZM35.976 11.8506V13.4095H37.9176V18.9757H39.4512V13.4095H41.3688V11.8506H35.976ZM32.1648 11.8751L29.6952 18.951H31.1088L31.6848 17.3677H34.2744L34.8504 18.951H36.24L33.8184 11.8751H32.1648ZM58.4352 11.8996C57.2064 11.8996 56.7336 12.4657 56.7336 13.434V14.4725C56.7336 15.4312 57.12 15.7503 58.1448 15.9079L59.6064 16.1306C59.964 16.189 60.0624 16.3062 60.0624 16.625V17.2934C60.0624 17.5681 59.9472 17.7138 59.6784 17.7138H56.7552V18.4555C57.012 18.7642 57.5664 18.8528 57.9768 18.8514H59.7768C60.9312 18.8514 61.332 18.351 61.332 17.3425V16.2785C61.332 15.2732 61.0368 14.97 60.1344 14.8439L58.4352 14.5969C58.152 14.5582 57.9768 14.4549 57.9768 14.1264V13.5076C57.9768 13.1665 58.0512 13.0627 58.3368 13.0627H61.0944V12.2955C60.8712 12.0034 60.2808 11.8996 59.8728 11.8996H58.4352ZM52.536 12.7657C52.6464 12.7563 52.7664 12.7657 52.896 12.7657C53.94 12.7657 54.312 13.0317 54.312 14.2503V16.3528C54.312 17.6021 53.94 17.887 52.896 17.887C51.8544 17.887 51.4824 17.6021 51.4824 16.3528V14.2503C51.4824 13.1838 51.768 12.8331 52.536 12.7657ZM32.9784 13.8299L33.6984 15.8088L32.2128 15.8335L32.9784 13.8299Z");
    			attr_dev(path, "fill", "#B8BBBE");
    			add_location(path, file$3, 17, 4, 335);
    			attr_dev(svg, "class", "w-12 h-12");
    			attr_dev(svg, "viewBox", "0 0 72 19");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg, file$3, 11, 2, 221);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('DolbyIcon', slots, []);
    	let { size = "100%" } = $$props;

    	if (size !== "100%") {
    		size = size.slice(-1) === "x"
    		? size.slice(0, size.length - 1) + "em"
    		: parseInt(size) + "px";
    	}

    	const writable_props = ['size'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<DolbyIcon> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('size' in $$props) $$invalidate(0, size = $$props.size);
    	};

    	$$self.$capture_state = () => ({ size });

    	$$self.$inject_state = $$props => {
    		if ('size' in $$props) $$invalidate(0, size = $$props.size);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [size];
    }

    class DolbyIcon extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { size: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DolbyIcon",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get size() {
    		throw new Error("<DolbyIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<DolbyIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Common/svg-netflix/Icons/Dolby2Icon.svelte generated by Svelte v3.44.3 */

    const file$2 = "src/Common/svg-netflix/Icons/Dolby2Icon.svelte";

    function create_fragment$2(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M2.497 26.6448C2.3424 27.1031 2.18227 27.6 2.08841 27.9147H2.0608C1.97246 27.6055 1.80681 27.1086 1.65221 26.6448L0.801905 24.1104H0.1835L1.69638 28.4945H2.43626L3.94914 24.1104H3.35283L2.497 26.6448ZM4.9651 28.4945H5.55037V24.1104H4.9651V28.4945ZM8.45467 25.927C7.85835 25.8883 7.38902 25.8994 7.38902 25.2368C7.38902 24.773 7.76448 24.519 8.42154 24.519C8.69761 24.519 9.11172 24.5301 9.52583 24.6681V24.1822C9.16141 24.0552 8.64792 24.0331 8.43258 24.0331C7.57675 24.0331 6.7651 24.2982 6.7651 25.281C6.7651 26.2307 7.37798 26.4847 8.13994 26.5123C8.76939 26.5288 9.23872 26.5841 9.23872 27.2798C9.23872 27.7436 8.91295 28.0638 8.09025 28.0638C7.81417 28.0638 7.22338 28.0362 6.80375 27.8816V28.3951C7.17921 28.5497 7.86387 28.5773 8.07921 28.5773C8.96264 28.5773 9.86264 28.2791 9.86264 27.219C9.86816 26.1534 9.16694 25.9767 8.45467 25.927ZM10.9835 28.4945H11.5743V24.1104H10.9835V28.4945ZM16.5491 26.3025C16.5491 27.7215 16.1406 28.5718 14.6774 28.5718C13.2142 28.5718 12.8111 27.716 12.8111 26.3025C12.8111 24.8834 13.2197 24.0331 14.6774 24.0331C16.1406 24.0331 16.5491 24.889 16.5491 26.3025ZM15.9363 26.3025C15.9363 25.0933 15.6657 24.519 14.6829 24.519C13.7001 24.519 13.4295 25.0933 13.4295 26.3025C13.4295 27.5117 13.7001 28.0859 14.6829 28.0859C15.6657 28.0859 15.9363 27.5117 15.9363 26.3025ZM20.6406 25.3196C20.6406 25.9656 20.6461 26.9374 20.6626 27.6276H20.6406C20.4418 27.2798 20.3093 27.0423 20.1215 26.7552L18.4154 24.1104H17.7915V28.4945H18.3602V27.2853C18.3602 26.6393 18.3547 25.6675 18.3436 24.9773H18.3602C18.559 25.3252 18.6915 25.5571 18.8792 25.8497L20.5853 28.4945H21.2148V24.1104H20.6461V25.3196H20.6406ZM21.2369 17.5288C21.0381 17.8767 19.6522 20.389 19.6522 20.389C19.6522 20.389 19.6522 21.8135 19.6522 22.0344H18.5645V20.3779C18.5645 20.3779 17.2283 17.8656 17.0406 17.5233H18.062L19.1498 19.5607L20.2761 17.5233H21.2369V17.5288ZM9.05099 19.1025V20.5215C9.05099 21.1564 8.85773 21.6092 8.47675 21.8466C8.18411 22.0509 7.67614 22.1503 6.96387 22.1503C6.24056 22.1503 5.74914 22.0509 5.43994 21.8411C5.06448 21.6202 4.87675 21.1785 4.87675 20.5215V19.1025C4.87675 18.4509 5.05896 18.0313 5.44546 17.7828C5.8154 17.5454 6.29577 17.4515 6.96387 17.4515C7.64301 17.4515 8.16755 17.5675 8.47675 17.7828C8.86325 18.0313 9.05099 18.4785 9.05099 19.1025ZM8.02951 19.108C8.02951 18.3294 7.74792 18.1583 6.96387 18.1583C6.17982 18.1583 5.89822 18.3294 5.89822 19.108V20.4607C5.89822 21.2613 6.1743 21.4436 6.96387 21.4436C7.74792 21.4436 8.02951 21.2613 8.02951 20.4607V19.108ZM2.59638 22.0344H0.177979V17.5233H2.44178C3.73381 17.5233 4.23626 18.0092 4.23626 19.246V20.2399C4.23074 21.5485 3.78902 22.0344 2.59638 22.0344ZM2.4473 21.3387C2.80068 21.3387 3.22031 21.1399 3.22031 20.3503V19.119C3.22031 18.3847 2.80068 18.1859 2.4473 18.1859H1.19945V21.3387H2.4473V21.3387ZM9.80191 17.5288V22.0399H12.7007V21.289H10.8234V17.5288H9.80191V17.5288ZM16.9467 20.8417C16.9467 21.3552 16.6651 21.6755 16.4498 21.8245C16.3228 21.9129 16.0522 22.0399 15.3952 22.0399H13.2583V17.5288H15.362C15.8424 17.5288 16.0688 17.6117 16.262 17.7331C16.4939 17.8767 16.7037 18.1307 16.7037 18.6221C16.7037 19.1853 16.5326 19.5773 15.732 19.6491C16.7369 19.627 16.9467 20.2344 16.9467 20.8417ZM16.0246 20.6209C16.0246 19.8975 15.4669 19.9417 14.7712 19.9417V19.4172C15.5498 19.3896 15.8258 19.373 15.8258 18.8098C15.8258 18.4399 15.616 18.1748 15.2737 18.1748H14.2688V18.1804V21.3828V21.3883H15.1909C15.7982 21.3828 16.0246 20.9798 16.0246 20.6209ZM21.2534 15.5853H0.1835V0.964417H21.2534V15.5853V15.5853ZM9.6473 8.25276C9.6473 5.3319 7.56571 2.85828 5.07 2.85828H2.66816V13.6914H5.07C7.56019 13.6969 9.6473 11.262 9.6473 8.25276ZM18.7743 2.85828H16.3669C13.8712 2.85828 11.7896 5.3319 11.7896 8.25276C11.7896 11.262 13.8712 13.6914 16.3669 13.6914H18.7743V2.85828V2.85828Z");
    			attr_dev(path, "fill", "#C4C4C4");
    			add_location(path, file$2, 17, 2, 303);
    			attr_dev(svg, "class", "w-6 h-6 m-4");
    			attr_dev(svg, "viewBox", "0 0 22 29");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg, file$2, 11, 0, 199);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Dolby2Icon', slots, []);
    	let { size = "100%" } = $$props;

    	if (size !== "100%") {
    		size = size.slice(-1) === "x"
    		? size.slice(0, size.length - 1) + "em"
    		: parseInt(size) + "px";
    	}

    	const writable_props = ['size'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Dolby2Icon> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('size' in $$props) $$invalidate(0, size = $$props.size);
    	};

    	$$self.$capture_state = () => ({ size });

    	$$self.$inject_state = $$props => {
    		if ('size' in $$props) $$invalidate(0, size = $$props.size);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [size];
    }

    class Dolby2Icon extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { size: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Dolby2Icon",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get size() {
    		throw new Error("<Dolby2Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Dolby2Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Common/svg-netflix/Icons/PlayButton.svelte generated by Svelte v3.44.3 */

    const file$1 = "src/Common/svg-netflix/Icons/PlayButton.svelte";

    function create_fragment$1(ctx) {
    	let svg;
    	let path0;
    	let path1;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			attr_dev(path0, "d", "M11 23C10.7348 23 10.4804 22.8946 10.2929 22.7071C10.1054 22.5195 10 22.2652 10 22V9.99995C10.0001 9.82956 10.0437 9.66202 10.1267 9.51323C10.2098 9.36443 10.3294 9.23932 10.4744 9.14976C10.6194 9.0602 10.7848 9.00917 10.955 9.0015C11.1252 8.99383 11.2946 9.02979 11.447 9.10595L23.447 15.106C23.6129 15.1891 23.7524 15.3167 23.8498 15.4746C23.9473 15.6325 23.9989 15.8144 23.9989 16C23.9989 16.1855 23.9473 16.3674 23.8498 16.5253C23.7524 16.6832 23.6129 16.8108 23.447 16.894L11.447 22.894C11.3082 22.9635 11.1552 22.9998 11 23ZM12 11.618V20.382L20.764 16L12 11.618Z");
    			attr_dev(path0, "fill", "white");
    			add_location(path0, file$1, 17, 2, 299);
    			attr_dev(path1, "d", "M16 4C18.3734 4 20.6935 4.70379 22.6668 6.02236C24.6402 7.34094 26.1783 9.21509 27.0866 11.4078C27.9948 13.6005 28.2325 16.0133 27.7694 18.3411C27.3064 20.6689 26.1635 22.8071 24.4853 24.4853C22.8071 26.1635 20.6689 27.3064 18.3411 27.7694C16.0133 28.2324 13.6005 27.9948 11.4078 27.0866C9.21509 26.1783 7.34095 24.6402 6.02237 22.6668C4.70379 20.6935 4.00001 18.3734 4.00001 16C4.00001 12.8174 5.26429 9.76515 7.51472 7.51472C9.76516 5.26428 12.8174 4 16 4ZM16 2C13.2311 2 10.5243 2.82109 8.22202 4.35943C5.91973 5.89777 4.12532 8.08427 3.06569 10.6424C2.00607 13.2006 1.72882 16.0155 2.26901 18.7313C2.80921 21.447 4.14258 23.9416 6.10051 25.8995C8.05845 27.8574 10.553 29.1908 13.2687 29.731C15.9845 30.2712 18.7994 29.9939 21.3576 28.9343C23.9157 27.8747 26.1022 26.0803 27.6406 23.778C29.1789 21.4757 30 18.7689 30 16C30 12.287 28.525 8.72601 25.8995 6.1005C23.274 3.475 19.713 2 16 2Z");
    			attr_dev(path1, "fill", "white");
    			add_location(path1, file$1, 21, 2, 906);
    			attr_dev(svg, "class", "w-6 h-6");
    			attr_dev(svg, "viewBox", "0 0 32 32");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg, file$1, 11, 0, 199);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path0);
    			append_dev(svg, path1);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('PlayButton', slots, []);
    	let { size = "100%" } = $$props;

    	if (size !== "100%") {
    		size = size.slice(-1) === "x"
    		? size.slice(0, size.length - 1) + "em"
    		: parseInt(size) + "px";
    	}

    	const writable_props = ['size'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<PlayButton> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('size' in $$props) $$invalidate(0, size = $$props.size);
    	};

    	$$self.$capture_state = () => ({ size });

    	$$self.$inject_state = $$props => {
    		if ('size' in $$props) $$invalidate(0, size = $$props.size);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [size];
    }

    class PlayButton extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { size: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PlayButton",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get size() {
    		throw new Error("<PlayButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<PlayButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/App.svelte generated by Svelte v3.44.3 */
    const file = "src/App.svelte";

    function create_fragment(ctx) {
    	let navbar;
    	let t0;
    	let div6;
    	let div4;
    	let div3;
    	let div2;
    	let img;
    	let img_src_value;
    	let t1;
    	let h3;
    	let t3;
    	let p0;
    	let t5;
    	let p1;
    	let t7;
    	let div0;
    	let dolbyicon;
    	let t8;
    	let dolby2icon;
    	let t9;
    	let div1;
    	let button;
    	let span;
    	let t11;
    	let playbutton;
    	let t12;
    	let div5;
    	let t13;
    	let video;
    	let source;
    	let source_src_value;
    	let t14;
    	let credits;
    	let current;
    	navbar = new Navbar({ $$inline: true });
    	dolbyicon = new DolbyIcon({ $$inline: true });
    	dolby2icon = new Dolby2Icon({ $$inline: true });
    	playbutton = new PlayButton({ $$inline: true });
    	credits = new Credits({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(navbar.$$.fragment);
    			t0 = space();
    			div6 = element("div");
    			div4 = element("div");
    			div3 = element("div");
    			div2 = element("div");
    			img = element("img");
    			t1 = space();
    			h3 = element("h3");
    			h3.textContent = "Clifford the Big Red Dog";
    			t3 = space();
    			p0 = element("p");
    			p0.textContent = "As Emily struggles to fit in at home and at school, she discovers a\n          small red puppy who is destined to become her best friend. When\n          Clifford magically undergoes one heck of a growth spurt, becomes a\n          gigantic dog and attracts the attention of a genetics company, Emily\n          and her Uncle Casey have to fight the forces of greed as they go on\n          the run across New York City. Along the way, Clifford affects the\n          lives of everyone around him and teaches Emily and her uncle the true\n          meaning of acceptance and unconditional love.";
    			t5 = space();
    			p1 = element("p");
    			p1.textContent = "Sci-Fi, Action, Comedy, Adventure";
    			t7 = space();
    			div0 = element("div");
    			create_component(dolbyicon.$$.fragment);
    			t8 = space();
    			create_component(dolby2icon.$$.fragment);
    			t9 = space();
    			div1 = element("div");
    			button = element("button");
    			span = element("span");
    			span.textContent = "Play Now";
    			t11 = space();
    			create_component(playbutton.$$.fragment);
    			t12 = space();
    			div5 = element("div");
    			t13 = space();
    			video = element("video");
    			source = element("source");
    			t14 = space();
    			create_component(credits.$$.fragment);
    			if (!src_url_equal(img.src, img_src_value = "https://occ-0-58-64.1.nflxso.net/dnm/api/v6/LmEnxtiAuzezXBjYXPuDgfZ4zZQ/AAAABe_MJtJKPmsSU3pjUiW7bRyT8Hg_kAJPLRj6rNNltpjGgSphvfVGjXLQ-_Ic1FIYJ319RRDnIdqPk9D8Uq2X8oHSGVrwbHfx3j1dW_6GncJ2IKZ3OVRybWHjTMdUVY_CLeo3z2EQotzC1-faA7LSygaF5sxsqoskzrVPj6n-NS80jg.png?r=4af")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			add_location(img, file, 13, 8, 603);
    			attr_dev(h3, "class", "text-2xl font-semibold text-white mb-4");
    			add_location(h3, file, 17, 8, 921);
    			attr_dev(p0, "class", "text-xs text-white font-thin text-justify");
    			add_location(p0, file, 20, 8, 1030);
    			attr_dev(p1, "class", "text-xs text-gray-500 font-thin mt-2");
    			add_location(p1, file, 30, 8, 1703);
    			attr_dev(div0, "class", "flex");
    			add_location(div0, file, 34, 8, 1818);
    			attr_dev(span, "class", "text-white font-semibold text-xl");
    			add_location(span, file, 43, 12, 2114);
    			attr_dev(button, "class", "px-3 mt-5 items-center shadow-md rounded-lg bg-red-600 space-x-2 py-4 justify-center flex w-56");
    			add_location(button, file, 40, 10, 1965);
    			attr_dev(div1, "class", "flex space-x-4 flex-row w-full");
    			add_location(div1, file, 39, 8, 1910);
    			attr_dev(div2, "class", "hidden lg:flex flex-col w-2/5 py-12 ");
    			add_location(div2, file, 12, 6, 544);
    			attr_dev(div3, "class", "px-16 h-full flex items-center justify-start");
    			add_location(div3, file, 11, 4, 478);
    			attr_dev(div4, "class", "absolute w-full h-full z-10 ");
    			add_location(div4, file, 10, 2, 431);
    			attr_dev(div5, "class", "absolute w-full h-64 bottom-0 bg-gradient-to-t from-black");
    			add_location(div5, file, 50, 2, 2274);
    			attr_dev(source, "class", "h-screen object-contain");
    			if (!src_url_equal(source.src, source_src_value = "https://file-examples-com.github.io/uploads/2017/04/file_example_MP4_1280_10MG.mp4")) attr_dev(source, "src", source_src_value);
    			attr_dev(source, "type", "video/mp4");
    			add_location(source, file, 57, 4, 2456);
    			attr_dev(video, "class", "w-full h-64 lg:h-screen object-cover -mt-8 ");
    			video.autoplay = true;
    			video.muted = true;
    			video.loop = true;
    			add_location(video, file, 51, 2, 2350);
    			attr_dev(div6, "class", "w-full h-screen relative");
    			add_location(div6, file, 9, 0, 390);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(navbar, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div6, anchor);
    			append_dev(div6, div4);
    			append_dev(div4, div3);
    			append_dev(div3, div2);
    			append_dev(div2, img);
    			append_dev(div2, t1);
    			append_dev(div2, h3);
    			append_dev(div2, t3);
    			append_dev(div2, p0);
    			append_dev(div2, t5);
    			append_dev(div2, p1);
    			append_dev(div2, t7);
    			append_dev(div2, div0);
    			mount_component(dolbyicon, div0, null);
    			append_dev(div0, t8);
    			mount_component(dolby2icon, div0, null);
    			append_dev(div2, t9);
    			append_dev(div2, div1);
    			append_dev(div1, button);
    			append_dev(button, span);
    			append_dev(button, t11);
    			mount_component(playbutton, button, null);
    			append_dev(div6, t12);
    			append_dev(div6, div5);
    			append_dev(div6, t13);
    			append_dev(div6, video);
    			append_dev(video, source);
    			insert_dev(target, t14, anchor);
    			mount_component(credits, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navbar.$$.fragment, local);
    			transition_in(dolbyicon.$$.fragment, local);
    			transition_in(dolby2icon.$$.fragment, local);
    			transition_in(playbutton.$$.fragment, local);
    			transition_in(credits.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navbar.$$.fragment, local);
    			transition_out(dolbyicon.$$.fragment, local);
    			transition_out(dolby2icon.$$.fragment, local);
    			transition_out(playbutton.$$.fragment, local);
    			transition_out(credits.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(navbar, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div6);
    			destroy_component(dolbyicon);
    			destroy_component(dolby2icon);
    			destroy_component(playbutton);
    			if (detaching) detach_dev(t14);
    			destroy_component(credits, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Navbar,
    		Credits,
    		DolbyIcon,
    		Dolby2Icon,
    		PlayButton
    	});

    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'world'
    	}
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
