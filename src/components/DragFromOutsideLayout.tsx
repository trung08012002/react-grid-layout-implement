import React, { ReactNode, useMemo } from "react";
import { useState } from "react";
import { Layouts, Responsive, WidthProvider } from "react-grid-layout";
import _ from "lodash";
import Item from "./Item";
import InputCustom from "./InputCustom";
import { useForm } from "react-hook-form";
import { Form } from "./ui/form";
import { Button } from "./ui/button";
import { toast } from "react-toastify";
const ResponsiveReactGridLayout = WidthProvider(Responsive);
interface Props {
    className?: string;
    rowHeight?: number;
    onLayoutChange?: Function;
    cols?: any;
}

type Layout = {
    x: number;
    y: number;
    w: number;
    h: number;
    i: string; // Identifier for the grid item
    static?: boolean; // Optional property indicating whether the item is static
};
type WidgetType = { widget: ReactNode, height: number, width: number };
export default function DragFromOutsideLayout({
    className = "layout",
    rowHeight = 30,
    onLayoutChange = function () { },
    cols = { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
}: Props) {
    const [compactType, setCompactType] = useState<
        "vertical" | "horizontal" | null
    >("horizontal");
    const [layouts, setLayouts] = useState<Layouts>({ lg: [] });
    const [currentComponent, setCurrentComponent] = useState<ReactNode>();
    const [widgetArray, setWidgetArray] = useState<WidgetType[]>([]);
    const form = useForm();

    const onCompactTypeChange = () => {
        setCompactType(
            compactType === "horizontal"
                ? "vertical"
                : compactType === "vertical"
                    ? null
                    : "horizontal",
        );
    };
    const onDrop = (
        layout: ReactGridLayout.Layout[],
        layoutItem: ReactGridLayout.Layout,
        _event: Event,
    ) => {
        const updateLayoutItem = {
            ...layoutItem,
            i: "n" + layout.length,
            x: layoutItem.x,
            y: layoutItem.y,
            w: 100,
            h: 50,
            isResizable: true,
            resizeHandles: undefined,
        };

        const updateWidget: WidgetType = { widget: currentComponent, height: 50, width: 100 };
        // Find the index of the dropped item in the layout
        const itemIndex = layout.findIndex((item) => item.i === layoutItem.i);

        // Update the layout with the modified layoutItem
        const newLayout = [...layout];
        newLayout.splice(itemIndex, 1, updateLayoutItem);

        const newWidgetArray = [
            ...widgetArray.slice(0, itemIndex),
            updateWidget,
            ...widgetArray.slice(itemIndex),
        ];
        // Set the state with the updated layout
        setLayouts({ lg: newLayout });
        setWidgetArray(newWidgetArray);
    };

    const generateDOM = () => {
        return _.map(widgetArray, function (l, i) {
            return (
                <div key={i} data-grid={layouts.lg[i]}>
                    <div style={{ width: `${l.width}px`, height: `${l.height}px` }}>
                        {l.widget}
                    </div>
                </div>
            );
        });
    };
    const items = [
        {
            component: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    style={{ width: "25px", height: "20px" }}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                    />
                </svg>
            ),
            title: "Email",
            componentActive:
                <InputCustom

                    label="Email"
                    name="email"
                    formReactHookForm={form}
                    control={form.control}
                    rules={{ required: true, pattern: /^\S+@\S+\.\S+$/ }}
                />

        },
    ];
    function onSubmit(data: any) {
        console.log(data);
    }
    return (
        <div className="relative">
            {items.map((item, index) => (
                <div
                    key={index}
                    className="droppable-element"
                    draggable={true}
                    unselectable="on"
                    // this is a hack for firefox
                    // Firefox requires some kind of initialization
                    // which we can do by adding this attribute
                    // @see https://bugzilla.mozilla.org/show_bug.cgi?id=568313
                    onDragStart={(e) => {
                        e.dataTransfer.setData("text/plain", "");
                        setCurrentComponent(item.componentActive);
                    }}
                >
                    <Item
                        icon={item.component}
                        classIcon="h-6 w-6"
                        classTitle=""
                        title={item.title}
                    />
                </div>
            ))}
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div>
                        <ResponsiveReactGridLayout
                            className="layout"
                            rowHeight={rowHeight}
                            cols={cols}
                            layouts={layouts}
                            onDrop={onDrop}
                            isDroppable={true}
                            compactType={compactType}
                        >
                            {generateDOM()}
                        </ResponsiveReactGridLayout>
                    </div>

                    {widgetArray.length > 0 ? (
                        <Button type="submit" className="px-3 py-2 bg-red-500">
                            Submit
                        </Button>
                    ) : null}
                </form>
            </Form>
        </div>
    );
}
