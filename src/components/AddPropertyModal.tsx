import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner"; // Importamos toast aquí también

export function AddPropertyModal({ isOpen, onClose, onAddProperty }) {
  const [property, setProperty] = useState({
    title: "",
    location: "",
    price: "",
    monthlyRent: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProperty((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    // Basic validation
    if (!property.title || !property.price || !property.monthlyRent) {
      // CAMBIO AQUÍ: Reemplazamos alert por toast.error
      toast.error("Por favor, completa los campos principales.");
      return;
    }
    onAddProperty({
        ...property,
        price: parseFloat(property.price),
        monthlyRent: parseFloat(property.monthlyRent),
        roi: ((parseFloat(property.monthlyRent) * 12) / parseFloat(property.price)) * 100 
    });
    toast.success(`Propiedad "${property.title}" agregada.`);
    onClose(); // Close modal after adding
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Agregar Nueva Propiedad</DialogTitle>
          <DialogDescription>
            Ingresa los detalles de la propiedad que ya tienes o que estás analizando.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Título
            </Label>
            <Input id="title" name="title" value={property.title} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="location" className="text-right">
              Ubicación
            </Label>
            <Input id="location" name="location" value={property.location} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right">
              Precio (€)
            </Label>
            <Input id="price" name="price" type="number" value={property.price} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="monthlyRent" className="text-right">
              Renta Mensual (€)
            </Label>
            <Input id="monthlyRent" name="monthlyRent" type="number" value={property.monthlyRent} onChange={handleChange} className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>Guardar Propiedad</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}