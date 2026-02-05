import { EmailTemplate } from '../types/template';

export const EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    type: 'blank',
    name: 'Blank',
    icon: '📝',
    subjectTemplate: '',
    bodyTemplate: '',
  },
  {
    type: 'event',
    name: 'Event Invite',
    icon: '🎉',
    subjectTemplate: "You're Invited! [Event Name]",
    bodyTemplate: `<p><strong>Hey Princeton!</strong></p>
<p>Need a break from [studying / work / finals] or just looking for a fun way to relax, create, or connect with friends? Join [Organization Name] for <strong>[Event Name]</strong>!</p>
<p>Materials will be provided, as well as [food/snacks/drinks] and a chance to win [prizes]! All are welcome.</p>
<p><strong>📅 Date:</strong> [Day], [Date]<br>
<strong>🕙 Time:</strong> [Start–End Time]<br>
<strong>📍 Location:</strong> [Location]</p>
<p><strong>RSVP / Sign up:</strong> [Link / Instructions]</p>
<p>Hope to see you there!<br>
— [Organization Name]</p>`,
  },
  {
    type: 'application',
    name: 'Application',
    icon: '📨',
    subjectTemplate: 'Applications Now Open: [Position / Program / Opportunity Name]',
    bodyTemplate: `<p>Hi Princeton!</p>
<p>Are you interested in [field / topic / leadership / creativity / impact area]? [Organization / Team Name] is now accepting applications for <strong>[Position / Program Name]</strong>! This is a great opportunity to [learn new skills / gain experience / make an impact / contribute to a project / share your ideas].</p>
<p><strong>Application Deadline:</strong> [Day], [Date] at [Time]<br>
<strong>Apply here:</strong> [Link / Instructions]</p>
<p><strong>About [Organization / Program]:</strong><br>
[Provide 2–4 sentences describing the organization or program. Include mission, impact, notable projects, and why it’s meaningful.]</p>
<p><strong>What We’re Looking For:</strong></p>
<ul>
  <li>[Skills, interests, or qualities desired]</li>
  <li>[Roles, responsibilities, or positions available]</li>
  <li>[Optional: who can apply, e.g., class years, majors, experience level]</li>
</ul>
<p><strong>Why Apply:</strong></p>
<ul>
  <li>Gain hands-on experience in [field / role]</li>
  <li>Collaborate with peers and mentors</li>
  <li>Make a tangible impact in [community / organization / campus / field]</li>
  <li>Optional: Enjoy perks such as [food, prizes, networking, publications, or creative opportunities]</li>
</ul>
<p>Questions? Reach out to [Contact Name & Email] for more information.</p>
<p>We can’t wait to see your application and learn more about what you can bring to <strong>[Organization / Program Name]</strong>!<br>
— [Organization Name]</p>`,
  },
  {
    type: 'survey',
    name: 'Survey',
    icon: '🔎',
    subjectTemplate: 'Fill out our survey on [Subject]!',
    bodyTemplate: `<p><strong>Hi Princeton!</strong></p>
<p>We’re looking for your input on <strong>[Project / Tool / Topic / Study Name]</strong>! Your feedback will help us [improve the platform / design new features / better understand the topic / shape future updates].</p>
<p>The survey only takes [1–5 minutes], and to thank you for your time, you’ll [be entered into a raffle / receive a small gift / get free [snacks/prizes]]!</p>
<p><strong>Take the Survey Here:</strong> [Link / Instructions]</p>
<p><strong>Why Your Feedback Matters:</strong></p>
<ul>
  <li>Help us make [Project / Tool / Study] more useful, enjoyable, or impactful</li>
  <li>Influence the next updates, features, or design decisions</li>
  <li>Optional: Contribute to research, projects, or creative work that benefits the community</li>
</ul>
<p>Your responses will remain confidential / anonymous, and every opinion counts.</p>
<p>Thank you for taking a moment to share your thoughts. We really appreciate your help!<br>
— [Organization / Team Name]</p>`,
  },
  
];