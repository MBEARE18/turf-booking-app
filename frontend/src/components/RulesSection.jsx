import React from 'react';
import { ShieldAlert, Footprints, CigaretteOff, Trash2, Banknote, Clock, Gavel } from 'lucide-react';

const RulesSection = () => {
    const rules = [
        {
            icon: <Gavel size={24} />,
            text: "No wooden bats Allowed. If done so, they are Responsible for Any Damages.",
            type: "critical"
        },
        {
            icon: <CigaretteOff size={24} />,
            text: "No Smoking & TOBACCO inside the Turf.",
            type: "warning"
        },
        {
            icon: <Trash2 size={24} />,
            text: "All players Must Maintain Cleanliness inside the turf.",
            type: "info"
        },
        {
            icon: <Footprints size={24} />,
            text: "Please Avoid Slippers & use Non-Marking Shoes or play Barefoot.",
            type: "info"
        },
        {
            icon: <Trash2 size={24} />,
            text: "No Snacks Allowed inside, please throw waste in the BIN.",
            type: "warning"
        },
        {
            icon: <ShieldAlert size={24} />,
            text: "Please Carry Your own ball (if possible).",
            type: "neutral"
        },
        {
            icon: <Banknote size={24} />,
            text: "Please pay Advance while Booking.",
            type: "neutral"
        },
        {
            icon: <Clock size={24} />,
            text: "No Cancellation Allowed. Inform before 3 hours or Advance Amount Not Returned.",
            type: "critical"
        },
        {
            icon: <ShieldAlert size={24} />,
            text: "Please Don't Damage Any property inside the turf.",
            type: "critical"
        }
    ];

    return (
        <section className="section-container" id="rules">
            <div className="section-header">
                <h2>Rules & <span>Regulations</span></h2>
                <p>To ensure a safe and enjoyable game for everyone, please adhere to our ground rules.</p>
            </div>

            <div className="rules-grid">
                {rules.map((rule, index) => (
                    <div className={`rule-card ${rule.type}`} key={index}>
                        <div className="rule-icon-wrapper">
                            {rule.icon}
                        </div>
                        <p>{rule.text}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default RulesSection;
