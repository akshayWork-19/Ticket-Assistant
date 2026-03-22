import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Ticket, Clock, CheckCircle2, AlertCircle } from "lucide-react";

export default function DashboardStats({ tickets, currentFilter, onFilterChange }) {


    const stats = {
        total: tickets.length,
        open: tickets.filter(t => t.status === "TODO").length,
        inProgress: tickets.filter(t => t.status === "IN_PROGRESS").length,
        resolved: tickets.filter(t => t.status === "RESOLVED").length
    };

    const statCards = [
        {
            title: "Active Tickets ",
            value: stats.total,
            icon: <Ticket className='h-4 w-4 text-muted-foreground' />,
            color: "text-primary",
            filterValue: "ALL"
        },
        {
            title: " Awaiting Action",
            value: stats.open,
            icon: <AlertCircle className='h-4 w-4 text-orange-500' />,
            color: "text-orange-500",
            filterValue: "TODO"
        },
        {
            title: "Under Review",
            value: stats.inProgress,
            icon: <Clock className='h-4 w-4 text-blue-500' />,
            color: "text-blue-500",
            filterValue: "IN_PROGRESS"
        },
        {
            title: "Completed",
            value: stats.resolved,
            icon: <CheckCircle2 className='h-4 w-4 text-green-500' />,
            color: "text-green-500",
            filterValue: "RESOLVED"
        }
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {statCards.map((stat, index) => {

                const isActive = currentFilter === stat.filterValue;
                return (
                    <Card
                        key={index}
                        onClick={() => onFilterChange(stat.filterValue)}
                        className={`border-border/40 backdrop-blur-sm shadow-sm ring-1 ring-white/5 cursor-pointer transition-all hover:-translate-y-1 hover:shadow-md ${isActive ? 'bg-primary/10 border-primary/50' : 'bg-card/40 hover:bg-card/60'}`}
                    >
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
                            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                {stat.title}
                            </CardTitle>
                            {stat.icon}
                        </CardHeader>
                        <CardContent>
                            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                        </CardContent>
                    </Card>
                );

            })}
        </div>
    );
}