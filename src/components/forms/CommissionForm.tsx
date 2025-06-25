"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import S3UploadImage from "@/components/upload/S3UploadImage";
import { format } from "date-fns";
import Image from "next/image"

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  category: z.enum(["Sketch", "Painting", "DigitalArt"]),
  budget: z.coerce.number().min(0, "Budget must be a positive number"),
  deadline: z.date().min(new Date(), "Deadline must be in the future"),
  requirements: z.string().min(1, "Requirements are required"),
  size: z.string().optional(),
  medium: z.string().optional(),
  style: z.string().optional(),
});

interface CommissionFormProps {
  onSuccess?: () => void;
}

export default function CommissionForm({ onSuccess }: CommissionFormProps) {
  const [loading, setLoading] = useState(false);
  const [referenceImages, setReferenceImages] = useState<string[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      budget: 0,
      requirements: "",
      deadline: undefined,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);

      const response = await fetch("/api/commissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          reference: referenceImages,
        }),
      });

      if (!response.ok) {
        return new Error("Failed to create commission");
      }

      toast.success("Commission request created successfully");
      onSuccess?.();
      form.reset();
      setReferenceImages([]);
    } catch (error) {
      toast.error("Something went wrong" + error);
    } finally {
      setLoading(false);
    }
  };

  const removeImage = (index: number) => {
    setReferenceImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter commission title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe what you want"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Sketch">Sketch</SelectItem>
                  <SelectItem value="Painting">Painting</SelectItem>
                  <SelectItem value="DigitalArt">Digital Art</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="budget"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Budget (₹)</FormLabel>
                <FormControl>
                  <Input type="number" min="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="deadline"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Deadline</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    value={field.value ? format(field.value, "yyyy-MM-dd") : ""}
                    onChange={e => {
                      const val = e.target.value ? new Date(e.target.value) : undefined;
                      field.onChange(val);
                    }}
                    min={format(new Date(), "yyyy-MM-dd")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="requirements"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Requirements</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="List your specific requirements"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="size"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Size (optional)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 24x36 inches" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="medium"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Medium (optional)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Oil paint" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="style"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Style (optional)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Abstract" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <div>
            <FormLabel>Reference Images (optional)</FormLabel>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
              {referenceImages.map((url, index) => (
                <div key={index} className="relative aspect-square">
                  <Image
                    src={url}
                    width={100}
                    height={100}
                    alt={`Reference ${index + 1}`}
                    className="object-cover rounded-lg w-full h-full"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => removeImage(index)}
                  >
                    ×
                  </Button>
                </div>
              ))}
              {referenceImages.length < 3 && (
                <S3UploadImage
                  onUpload={(url) =>
                    setReferenceImages((prev) => [...prev, url])
                  }
                  className="aspect-square"
                >
                  <div className="flex items-center justify-center border-2 border-dashed rounded-lg cursor-pointer aspect-square hover:border-gray-400 transition-colors">
                    <span className="text-gray-600">+ Add Reference</span>
                  </div>
                </S3UploadImage>
              )}
            </div>
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating..." : "Submit Commission Request"}
        </Button>
      </form>
    </Form>
  );
} 