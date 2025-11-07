import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface MultiSelectOption {
    label: string;
    value: string | number;
}

interface MultiSelectProps {
    options: MultiSelectOption[];
    selected: (string | number)[];
    onChange: (selected: (string | number)[]) => void;
    placeholder?: string;
    searchPlaceholder?: string;
    className?: string;
    disabled?: boolean;
    error?: boolean;
}

export function MultiSelect({
    options,
    selected,
    onChange,
    placeholder = "Seleziona...",
    searchPlaceholder = "Cerca...",
    className,
    disabled,
    error,
}: MultiSelectProps) {
    const [open, setOpen] = React.useState(false);
    const [search, setSearch] = React.useState("");
    const inputRef = React.useRef<HTMLInputElement>(null);

    const filteredOptions = React.useMemo(() => {
        if (!search) return options;
        const searchLower = search.toLowerCase();
        return options.filter((option) =>
            option.label.toLowerCase().includes(searchLower)
        );
    }, [options, search]);

    const toggleOption = (value: string | number) => {
        const newSelected = selected.includes(value)
            ? selected.filter((s) => s !== value)
            : [...selected, value];
        onChange(newSelected);
    };

    const removeOption = (value: string | number, e: React.MouseEvent) => {
        e.stopPropagation();
        onChange(selected.filter((s) => s !== value));
    };

    const selectedOptions = options.filter((opt) => selected.includes(opt.value));

    React.useEffect(() => {
        if (open && inputRef.current) {
            inputRef.current.focus();
        } else if (!open) {
            setSearch("");
        }
    }, [open]);

    React.useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape" && open) {
                setOpen(false);
            }
        };

        if (open) {
            document.addEventListener("keydown", handleEscape);
            return () => document.removeEventListener("keydown", handleEscape);
        }
    }, [open]);

    return (
        <div className={cn("relative", className)}>
            <div
                role="combobox"
                aria-expanded={open}
                aria-haspopup="listbox"
                tabIndex={disabled ? -1 : 0}
                className={cn(
                    "inline-flex items-center justify-between gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                    "border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground",
                    "w-full min-h-9 h-auto py-2 px-3 cursor-pointer",
                    error && "border-red-500 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                    disabled && "opacity-50 cursor-not-allowed pointer-events-none"
                )}
                onClick={() => !disabled && setOpen(!open)}
                onKeyDown={(e) => {
                    if (!disabled && (e.key === "Enter" || e.key === " ")) {
                        e.preventDefault();
                        setOpen(!open);
                    }
                }}
            >
                <div className="flex flex-wrap gap-1 flex-1">
                    {selectedOptions.length > 0 ? (
                        selectedOptions.map((option) => (
                            <span
                                key={option.value}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground text-sm"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {option.label}
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeOption(option.value, e);
                                    }}
                                    className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                                    aria-label={`Rimuovi ${option.label}`}
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </span>
                        ))
                    ) : (
                        <span className="text-muted-foreground">{placeholder}</span>
                    )}
                </div>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50 pointer-events-none" />
            </div>

            {open && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setOpen(false)}
                        onMouseDown={(e) => e.preventDefault()}
                    />
                    <div 
                        className="absolute z-50 w-full mt-1 bg-popover border rounded-md shadow-md"
                        onMouseDown={(e) => e.stopPropagation()}
                    >
                        <div className="p-2 border-b">
                            <Input
                                ref={inputRef}
                                placeholder={searchPlaceholder}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="h-8"
                                onClick={(e) => e.stopPropagation()}
                                onMouseDown={(e) => e.stopPropagation()}
                            />
                        </div>
                        <div className="max-h-60 overflow-auto p-1">
                            {filteredOptions.length === 0 ? (
                                <div className="px-2 py-6 text-center text-sm text-muted-foreground">
                                    Nessun risultato trovato
                                </div>
                            ) : (
                                filteredOptions.map((option) => {
                                    const isSelected = selected.includes(option.value);
                                    return (
                                        <button
                                            key={option.value}
                                            type="button"
                                            role="option"
                                            aria-selected={isSelected}
                                            className={cn(
                                                "relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                                                isSelected && "bg-accent"
                                            )}
                                            onClick={() => toggleOption(option.value)}
                                        >
                                            <div className="flex items-center gap-2 flex-1">
                                                <div
                                                    className={cn(
                                                        "flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                                        isSelected && "bg-primary text-primary-foreground"
                                                    )}
                                                >
                                                    {isSelected && (
                                                        <Check className="h-3 w-3" />
                                                    )}
                                                </div>
                                                <span>{option.label}</span>
                                            </div>
                                        </button>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

