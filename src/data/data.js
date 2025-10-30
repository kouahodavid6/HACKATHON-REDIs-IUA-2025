import {
    // Users,
    // ShieldHalf,
    // FolderTree,
    // FileText,
    // HelpCircle,
    // ListChecks,
    Calendar,
    Bell
}
from "lucide-react";

// const cards = [
//     //Exemple de value: status.students,
//     { title: 'Étudiants', value: 100, icon: Users, color: 'bg-blue-500' },
//     { title: 'Équipes', value: 25, icon: ShieldHalf, color: 'bg-green-500' },
//     { title: 'Domaines', value: 4, icon: FolderTree, color: 'bg-yellow-500' },
//     { title: 'Épreuves', value: 8, icon: FileText, color: 'bg-red-500' },
// ];

const modules = [
    //{ title: 'Questions', icon: HelpCircle, path: '/questions', color: 'bg-cyan-500' },
    // { title: 'Propositions', icon: ListChecks, path: '/propositions', color: 'bg-indigo-500' },
    { title: 'Programmes', icon: Calendar, path: '/programme', color: 'bg-pink-500' },
    { title: 'Annonces', icon: Bell, path: '/annonces', color: 'bg-orange-500' },
];

export const data  = {
    modules
}