import { Document, Types } from "mongoose";

export interface IProduct extends Document {
    name: string;
    description: string;
    price: number;
    media_url: string;
    category: string;
    tags: string[];
}