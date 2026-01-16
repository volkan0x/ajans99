"use client";

import { useState } from "react";
import { ChevronDown } from "@untitledui/icons";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

interface MenuItem {
  id: string;
  label: string;
}

interface DropdownButtonProps {
  items: MenuItem[];
  defaultItemId?: string;
}

export const DropdownButton = ({ items, defaultItemId }: DropdownButtonProps) => {
  const [selectedItem, setSelectedItem] = useState(defaultItemId || items[0]?.id);

  return (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button className="group border-2 border-gray-300 w-full" variant="secondary" iconTrailing={ChevronDown}>
                {items.find(item => item.id === selectedItem)?.label}
            </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent>
            {items.map((item) => (
              <DropdownMenuItem 
                key={item.id} 
                onClick={() => setSelectedItem(item.id)}
                className="cursor-pointer"
              >
                {item.label}
                {selectedItem === item.id && (
                  <Check className="ml-auto h-4 w-4" />
                )}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
        </DropdownMenuContent>
    </DropdownMenu>
  );
};