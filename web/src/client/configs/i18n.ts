import { i18n }  from 'i18n-client';
import { config } from 'semanticui-react';

export const mf = i18n.translate;

export default function() {
  // add custom translation function
  config.i18n = i18n.translate;

  // add default english translations
  i18n.add('en', {
    'activity': 'Activity',
    'add': 'Add',
    'admin.groups.header': 'Groups',
    'admin': 'Admin',
    'adminMenu': 'Admin',
    'All': 'All',
    'animation.name': 'Animation Name',
    'animations.frames': 'Animation Frame',
    'animations.name': 'Animations Name',
    'areYouSure': 'Are you sure?',
    'avatar': 'Avatar',
    'awards.label': 'Awards',
    'awards.info': 'Clara\'s world have atracted the gold medal in 2015 ACS education distruptors challenge, winning the category with participants from all major universities in Australia',
    'back': 'Back',
    'BadgeExercise1Stars': 'Fifth best solution in exercise',
    'BadgeExercise2Stars': 'Fourth best solution in exercise',
    'BadgeExercise3Stars': 'Third best solution in exercise',
    'BadgeExercise4Stars': 'Second best solution in exercise',
    'BadgeExercise5Stars': 'The best solution in exercise',
    'BadgeLoc1Stars': 'Tester: One solution with three gold stars',
    'BadgeLoc2Stars': 'Programmer: Three solutions with three gold stars',
    'BadgeLoc3Stars': 'Analyst: Six solutions with three gold stars',
    'BadgeLoc4Stars': 'Architect: Ten solutions with three gold stars',
    'BadgeLoc5Stars': 'Hacker: Fifteen solutions with three gold stars',
    'BadgeLocMaxStars': 'Badge for short solution',
    'BadgePractical1Stars': 'Fifth best in practical',
    'BadgePractical2Stars': 'Fourth best in practical',
    'BadgePractical3Stars': 'Third best in practical',
    'BadgePractical4Stars': 'Second in practical',
    'BadgePractical5Stars': 'Best in practical',
    'badges': 'Badges',
    'BadgeSchedule1Stars': 'Fifth best in schedule',
    'BadgeSchedule2Stars': 'Fourth best in schedule',
    'BadgeSchedule3Stars': 'Third best in schedule',
    'BadgeSchedule4Stars': 'Second best in schedule',
    'BadgeSchedule5Stars': 'The best in schedule',
    'BadgeSpeed1Stars': 'Complete the solution as fifth',
    'BadgeSpeed2Stars': 'Complete the solution as fourth',
    'BadgeSpeed3Stars': 'Complete the solution as third',
    'BadgeSpeed4Stars': 'Complete the solution as second',
    'BadgeSpeed5Stars': 'Be the first to complete the solution',
    'BadgeSteps1Stars': 'Thinker: One solution with two violet stars',
    'BadgeSteps2Stars': 'Optimiser: Three solutions with two violet stars',
    'BadgeSteps3Stars': 'Perfectionist: Six solutions with two violet stars',
    'BadgeSteps4Stars': 'Genius: Ten solutions with two violet stars',
    'BadgeSteps5Stars': 'Riddler: Fifteen solutions with two violet stars',
    'BadgeStepsMaxStars': 'Badge for efficient solution',
    'beautify': 'Beautify',
    'BestExerciseAchievement': 'You solution is currently #{rank} in exercise "{exerciseName}"!',
    'BestPracticalAchievement': 'You are currently #{rank} in practical "{practicalName}"!',
    'BestScheduleAchievement': 'You are currently #{rank} in schedule "{scheduleName}"!',
    'board.add': 'Add Board',
    'board.addInput': 'Add Input',
    'board.addOutput': 'Add Output',
    'board.addValidation': 'Add Validation',
    'board.completed': 'Board #{number} successfully completed!',
    'board.number': 'Board #',
    'board.validatePosition': 'Validate Position',
    'board.validationInout': 'Validation Input',
    'board.validationInputs': 'Validation Inputs',
    'board.validationNum': 'Validation #',
    'board.validationOutput': 'Validation Output',
    'board.validationOutputs': 'Validation Outputs',
    'board': 'Board',
    'boardEditor.noSolution': 'No solution loaded ...',
    'button.addExercise': 'Add Exercise',
    'button.backToClaras': 'Back to Clara\'s World',
    'button.cancel': 'Cancel',
    'button.delete': 'Delete',
    'button.save': 'Save',
    'calendar.adminSubHeader': 'View schedule calendars',
    'calendar.label': 'Calendar',
    'close': 'Close',
    'columns': 'Columns',
    'comment.inserted': 'Comment inserted',
    'comments.addComment': 'Add Comment',
    'comments.canUseMarkdown': 'You can use Markdown syntax in comments',
    'comments.empty': 'Please specify comment',
    'comments.noComments': 'There are no comments',
    'comments.onlyRegisteredCanPost': 'Only registered user can post comments',
    'comments.saveBeforeCommenting': 'Please save your solution before commenting',
    'comments': 'Comments',
    'community.bestPlayers': 'Leaderboards',
    'community.info': 'Get feedback on your progress from your Tutor, share your progress with the world, or create custom exercises and challenge your friends!',
    'community.label': 'Community',
    'community.privacyPolicy': 'Privacy Policy',
    'configuration.label': 'Configuration',
    'confirm.areYouSure': 'Are you sure you want to proceed?',
    'confirm.createSchedule': 'Do you wish to create a new schedule?',
    'confirm.createExercise': 'Do you wish to create a new exercise?',
    'confirm.createPractical': 'Do you wish to create a new practical? ',
    'confirm.delete': 'Do you want to delete this record?',
    'confirm.deleteFile': 'Do you want to delete this file?',
    'confirm.duplicate': 'Do you want to duplicate this record?',
    'confirm.sendMail': 'Do you wish to send this email?',
    'confirm.unsubscribe': 'Do you want to unsubscribe from this tutor?',
    'contact': 'Contact',
    'continue': 'Continue',
    'course.calendar': 'Calendar',
    'course.info': 'The programming course is designed to teach you programming and explore your problem solving skills in fun and interactive way.',
    'course.label': 'Course',
    'course.learningGuide': 'Learning Guide',
    'course.tutors': 'Tutors',
    'created': 'Created',
    'createdBy': 'Created By',
    'current': 'Current',
    'custom': 'Custom',
    'create': 'Create',
    'delete.board': 'Delete Board',
    'delete.validation': 'Delete Validation',
    'delete': 'Delete',
    'deleteIt': 'Yes, delete It!',
    'deleted': 'Deleted',
    'description': 'Description',
    'difficulty': 'Difficulty',
    'downloadZIP': 'Download ZIP',
    'DropBestExercise': 'Your solution for "{exerciseName}" just dropped in exercise ranking ;( Your current rank is #{rank}.',
    'DropBestPractical': 'Your rating in practical "{practicalName}" just dropped ;( Your current rank is #{rank}.',
    'DropBestSchedule': 'Your rating in schedule "{scheduleName}" just dropped ;( Your current rank is #{rank}.',
    'duplicate': 'Duplicate',
    'editor.autoPlay': 'Auto-Play',
    'editor.fileSaveInProgress': 'File save in progress ...',
    'editor.highlight': 'Highlight',
    'editor.youHaveUnsavedChanges': 'You have unsaved changes!',
    'editor': 'Editor',
    'email': 'Email',
    'error': 'Error',
    'error.exerciseDoesNotExist': 'Exercise does not exist ;(',
    'error.mail.bodyMissing': 'Mail body is missing',
    'error.mail.subjectMissing': 'Subject is missing',
    'error.mailNotSent': 'Mail not sent ;(',
    'error.nameEmpty': 'Name cannot be empty!',
    'error.notSubscribed': 'Missing Subscription!',
    'error.userNameCannotBeEmpty': 'Username cannot be empty!',
    'errors.suspectedCheating': 'Wow! Great solution, but it looks like your tutor needs to double check this one as your approach might not be in line with the assessment. Please contact your tutor.',
    'error.subscriptionError': 'You are not subscribed to any tutor. Please subscribe to your assigned tutor at the bottom of this page.',
    'error.missingWorldId': 'Please select first the world type (e.g. Clara\'s World)',
    'exercise.add': 'Add Exercise',
    'exercise.allowedCommand': 'Allowed Commands',
    'exercise.descriptionPlaceholder': 'Exercise',
    'exercise.easy': 'Easy',
    'exercise.empty': 'Empty',
    'exercise.hard': 'Hard',
    'exercise.hardcore': 'Hardcore',
    'exercise.loc1': 'Lines of Code',
    'exercise.loc2': 'Lines of Code',
    'exercise.loc3': 'Lines of Code',
    'exercise.mainImage': 'Main Image',
    'exercise.medium': 'Medium',
    'exercise.name': 'Name',
    'exercise.namePlaceholder': 'Name',
    'exercise.oneStar': 'One Star',
    'exercise.points': 'Points',
    'exercise.protectLoops': 'Protect Loops',
    'exercise.selectWorld': 'Select World',
    'exercise.selectWorldFirst': 'First, you have to select the world!',
    'exercise.threeStars': 'Three stars',
    'exercise.twoStars': 'Two stars',
    'exercise.cheatDetection': 'Cheat detection',
    'Exercise': 'Exercise',
    'exercises.label': 'Exercises',
    'exercises': 'Exercises',
    'failed': 'Failed',
    'file.add': 'Add File',
    'file.category': 'Category',
    'file.categoryEmpty': 'Please specify the category',
    'file.empty': 'Please specify filename',
    'file.info': 'Info',
    'file.library': 'Library',
    'file.name': 'Name',
    'file.order': 'Order',
    'file.showAllFiles': 'Show all files',
    'file.systemCode': 'System Code',
    'file.userCode': 'User Code',
    'files': 'Files',
    'find.student': 'Student',
    'globals': 'Globals',
    'group.active': 'Active',
    'group.disabled': 'Disabled',
    'group.doesNotExist': 'Selected group does not exist!',
    'groupEmail.subHeader': 'Send group email by schedule',
    'groupEmail': 'Group Email',
    'groupMail.label': 'Group Mail',
    'groups.nogroups': 'There are no groups',
    'groups.search': 'Find group',
    'groups': 'Groups',
    'history': 'History',
    'home.bottomIntroduction': 'In your browser, on your tablet or mobile, Clara is always ready to challenge your problem solving and programming skills, preparing you to be an awesome programmer!',
    'home.enterClara': 'Enter Clara\'s World',
    'home.topIntroduction': 'Learning programming has never been this much fun!',
    'home.tryItout': 'Why waste words, when you can try it out!',
    'image': 'Image',
    'incorrectOutput': 'Incorrect output. Please check exercise description!',
    'info.createError': 'Created failed ;(',
    'info.createSuccess': 'Created',
    'info.deleted': 'Deleted',
    'info.deleteFailed': 'Delete failed ;( ',
    'info.duplicated': 'Duplicated',
    'info.duplicateFailed': 'Duplicate failed ;(',
    'info.saveError': 'Save failed ;(',
    'info.saveSuccess': 'Saved',
    'info.unsupportedBrowser': 'Sorry, it looks like you are using a browser that is currently not supported by Clara\'s World',
    'info.unsupportedBrowserMore': 'If you\'d like to try out the exciting world of Clara we suggest that you use one of these browsers:',
    'leaderboard': 'Leaderboard',
    'leaderboards.adminSubHeader': 'It\'s always much more fun when we can compete!',
    'leaderboards.label': 'Leaderboards',
    'lecture': 'Lecture',
    'library.info': 'Our library holds a lot of different exercises crafted to teach you specific programming concepts or general problem solving skills.',
    'library.label': 'Library',
    'library.mostPopular': 'Most Popular',
    'library.public': 'Public',
    'library.recentExercises': 'Recent Exercises',
    'library.recentPracticals': 'Recent Practicals',
    'linesOfCode': 'Lines of code',
    'loading': 'Loading ...',
    'loading.badges': 'Loading badges ...',
    'loading.book': 'Loading Book ...',
    'loading.chapter': 'Loading Chapter ...',
    'loading.chapters': 'Loading Chapters ...',
    'loading.editor': 'Loading editor ...',
    'loading.exercise': 'Loading exercise ...',
    'loading.exercises': 'Loading exercises ...',
    'loading.groups': 'Loading groups ...',
    'loading.leaderboards': 'Loading leaderboards ...',
    'loading.notifications': 'Loading notifications ...',
    'loading.practical': 'Loading practical ...',
    'loading.profile': 'Loading profile ...',
    'loading.schedule': 'Loading schedule ...',
    'loading.schedules': 'Loading schedules ...',
    'loading.site': 'Loading site ...',
    'loading.sites': 'Loading sites ...',
    'loading.textEditor': 'Loading text editor ...',
    'loggingIn': 'Logging in ...',
    'LocAchievement': 'Yet another excellent and short solution! Total: {count}.',
    'localScope': 'Local Scope',
    'LocMasterAchievement': 'You have earned a new badge for short solutions! ',
    'mail.sent': 'Mail sent!',
    'mark': 'Mark',
    'Marked': 'Marked',
    'marking.markBiggerThanPoints': 'Mark is bigger that exercise points',
    'maintenance.header': 'System Maintenance',
    'maintenance.info': 'To makes your experience exceptional, the website is currently undergoing maintenance. We will be back soon! Please check bac later.',
    'menu': 'Menu',
    'modified': 'Modified',
    'modify': 'Modify',
    'name': 'Name',
    'next': 'Next',
    'noBadges': 'You have no badges ...',
    'NoBestExercise': 'You were eliminated from the top 5 best exercises ;(',
    'NoBestPractical': 'You were eliminated from the top 5 in practical "{practicalName}" ;(',
    'NoBestSchedule': 'You were eliminated from the top 5 in schedule "{scheduleName}" ;(',
    'noNotifications': 'You have no notifications ...',
    'noRecords': 'No records',
    'notifications': 'Notifications',
    'NotifyMarked': 'You were marked "{mark}" points for exercise "{exercise}"',
    'NotifyMarkRemoved': 'Your mark for exercise "{exercise}" was removed.',
    'oneStar': 'One Star',
    'Open': 'Open',
    'partner.label': 'Partner',
    'partner.info': 'The official partner of this tool is the Western Sydney University, belonging to top 100 young universities in the world.',
    'Pending': 'Pending',
    'permissions.groups': 'Groups',
    'permissions.label': 'Permissions',
    'permissions.noAccess': 'No Access',
    'permissions.other': 'Other',
    'permissions.owner': 'Owner',
    'permissions.readOnly': 'Read Only',
    'permissions.readWrite': 'Read/Write',
    'permissions': 'Permissions',
    'playerCrashed': 'Clara has crashed into an obstacle ;(',
    'playerDrowned': 'Oh no! Clara can\'t swim and she drowned ;(',
    'playerNotAtPosition': 'Player not at desired position',
    'points': 'Points',
    'practical.add': 'Add Practical',
    'practical.clickOnTitleForInstructions': 'click on title for instructions',
    'practical.descriptionPlaceholder': 'Practical description',
    'practical.findExercisePlaceholder': 'Find Exercise',
    'practical.imagePlaceholder': 'Image',
    'practical.label': 'Practical',
    'practical.lecturePlaceholder': 'Lecture',
    'practical.namePlaceholder': 'Name',
    'practical.practicalNotSpecified': 'Please specify practical',
    'practical.search': 'Search',
    'practicals.label': 'Practicals',
    'practicals.noresults': 'Your search has returned no results.',
    'preview': 'Preview',
    'previous': 'Previous',
    'privacyPolicy.label': 'Privacy Policy',
    'profile.avatar': 'Avatar',
    'profile.description': 'Description',
    'profile.groupDoesNotExist': 'Group does not exist',
    'profile.groups': 'Groups',
    'profile.info': 'Info',
    'profile.label': 'Profile',
    'profile.name': 'Name',
    'prompt.confirmDelete': 'Do you wish to delete this record?',
    'ranking': 'Ranking',
    'recordDeleted': 'Record was successfully deleted!',
    'remove': 'Remove',
    'results.exerciseInstructions': 'Select exercise to view leaderboards',
    'results.exerciseTitle': 'Exercise',
    'results.loc': 'Lines of Code',
    'results.lsrank': 'Ls Rank',
    'results.mailHeader': '[SCEM] Clara\'s World Leaderboards',
    'results.name': 'Name',
    'results.position': 'Position',
    'results.practicalsInstructions': 'Select practical to view leaderboards',
    'results.practicalTitle': 'Practical',
    'results.solutions': 'Solutions',
    'results.steps': 'Steps',
    'results.title': 'Leaderboards',
    'results.updated': 'Updated Results',
    'route.activity': 'Activity',
    'route.adminExercise': 'Exercise',
    'route.adminPractical': 'Practical',
    'route.adminSchedule': 'Schedule',
    'route.adminSite': 'Site',
    'route.adminSites': 'Sites',
    'route.adminWorld': 'World',
    'route.adminWorlds': 'Worlds',
    'route.book': 'Book',
    'route.bookChapter': 'Book',
    'route.calendar': 'Calendar',
    'route.configuration': 'Configuration',
    'route.editBook': 'Edit Book',
    'route.exercise': 'Exercise',
    'route.exerciseLeaderboards': 'Leaderboards',
    'route.exercises': 'Exercises',
    'route.groupMail': 'Mail',
    'route.leaderboards': 'Leaderboards',
    'route.marking': 'Marking',
    'route.practical': 'Practical',
    'route.practicalLeaderboards': 'Leaderboards',
    'route.practicals': 'Practicals',
    'route.profile': 'Profile',
    'route.schedule': 'Schedule',
    'route.scheduledTutors': 'Tutors',
    'route.scheduleLeaderboards': 'Leaderboards',
    'route.schedules': 'Schedules',
    'route.scheduledCalendar': 'Calendar',
    'route.siteSettings': 'Sites',
    'route.tutors': 'Tutors',
    'route.worlds': 'Worlds',
    'route.world': 'World',
    'rows': 'Rows',
    'run': 'Run',
    'save': 'Save',
    'schedule.add': 'Add Schedule',
    'schedule.addPractical': 'Add Practical',
    'schedule.addTutor': 'Add tutor',
    'schedule.description': 'Description',
    'schedule.DueDate': 'Due Date',
    'schedule.dueDate': 'Due Date',
    'schedule.duePlaceholder': 'Due',
    'schedule.fromPlaceholder': 'Visible From',
    'schedule.name': 'Name',
    'schedule.practicals': 'Practicals',
    'schedule.search': 'Find schedule',
    'schedule.select': 'Select Schedule',
    'schedule.selectTutor': 'Select Tutor',
    'schedule.startDate': 'Start Date',
    'schedule.subscribe': 'Subscribe',
    'schedule.tutorDetails': 'Details',
    'schedule.tutorName': 'Name',
    'schedule.tutors': 'Tutors',
    'schedule.unsubscribeWith': 'Unsubscribe from',
    'schedule.visibleFrom': 'Visible From',
    'schedule': 'Schedule',
    'schedules': 'Schedules',
    'schedules.adminSubHeader': 'Create, modify or delete schedules',
    'schedules.label': 'Schedules',
    'schedules.noschedules': 'There are no schedules',
    'schedules.offerAdd': 'Do you wish to create a new records?',
    'search.create': 'Create',
    'search.empty': 'Your search has returned no results ;(',
    'search.exercise': 'Find exercise',
    'search.noresults': 'Search returned no records',
    'search.practical': 'Find practicals',
    'security.accessDenied': 'Access Denied',
    'security.accessDeniedInfo': 'You have no access to this page. Please go back to the homepage.',
    'security.notFound': 'Page does not exist!',
    'security.notFoundInfo': 'This page does not exist! Please go back to the homepage',
    'selectTutor.header': 'Select Tutor',
    'send.onlyToMe': 'Send only to me',
    'sendMail': 'Send Mail',
    'settings': 'Settings',
    'site.account': 'Account',
    'site.accounts': 'Accounts',
    'site.activeGroups': 'Active Groups',
    'site.add': 'Add Site',
    'site.cssStyle': 'CSS Style',
    'site.defaultSite': 'Default site',
    'site.description': 'Description',
    'site.email.body': 'Body',
    'site.email.from': 'From',
    'site.email.password': 'Password',
    'site.email.server': 'Server',
    'site.email.subject': 'Subject',
    'site.email.user': 'User',
    'site.emails.server': 'Server',
    'site.group': 'Group',
    'site.groups': 'Groups',
    'site.inactiveGroups': 'Inactive groups',
    'site.name': 'Clara\'s World',
    'site.theme': 'Theme',
    'site.welcomeText': 'Welcome Text',
    'sites.accountParameters': 'Account Parameters',
    'sites.accountsConfiguration': 'Account Configuration',
    'sites.commentsConfiguration': 'Comments Configuration',
    'sites.emailConfiguration': 'Email Configuration',
    'sites.label': 'Sites',
    'sites.nosites': 'Your search returned no results',
    'sites.offerAdd': 'Your search returned no results. Do you wish to create this site?',
    'sites.search': 'Find site',
    'sites.subLabel': 'Create, modify or delete sites.',
    'siteSettings.label': 'Site Settings',
    'siteTitle': 'Clara\'s World',
    'solution.boardCompleted': 'Board Completed!',
    'solution.completed': 'Solution Completed!',
    'solution.exerciseSummary': 'Exercise summary',
    'solution.locOneStar': '{loc} lines of code. ★ Acceptable. {locImprovement} line(s) less for ★★.',
    'solution.locResult': 'Your have {loc} lines of code, while three star solution has {exLoc} lines of code.',
    'solution.locThreeStars': '{loc} lines of code. ★★★ Excellent!',
    'solution.locTwoStars': '{loc} lines of code. ★★ Good! {locImprovement} line(s) less for ★★★.',
    'solution.locZeroStars': '{loc} lines of code. No stars :( Try to make your code shorter.{locImprovement} line(s) less for ★.',
    'solution.mark': 'Mark',
    'solution.rank': 'Rank',
    'solution.removeSubmission': 'Remove Submission',
    'solution.stepsOneStar': 'Total {steps} steps ({stepsAverage} in average). ★ Good!. {stepsImprovement} step(s) less for ★★.',
    'solution.stepsOneStarSingle': 'Total {steps} steps. ★ Good!. {stepsImprovement} step(s) less for ★★.',
    'solution.stepsTwoStars': 'Total {steps} steps ({stepsAverage} in average). ★★ Excellent!',
    'solution.stepsTwoStarsSingle': 'Total {steps} steps. ★★ Excellent!',
    'solution.stepsZeroStars': 'Total {steps} steps ({stepsAverage} in average). No stars :( Try to make your code more efficient. {stepsImprovement} steps(s) less for ★.',
    'solution.stepsZeroStarsSingle': 'Total {steps} steps. No stars :( Try to make your code more efficient. {stepsImprovement} steps(s) less for ★.',
    'solution.submit': 'Submit Solution',
    'solution.worldNum': 'World #{world}',
    'solution.worldSteps': 'World #{worldNum} completed in {steps} step(s).',
    'speed.fast': 'Fast',
    'speed.instant': 'Instant',
    'speed.normal': 'Normal',
    'speed.slow': 'Slow',
    'speed.snail': 'Snail',
    'speed.supersonic': 'Supersonic',
    'speed.turbo': 'Turbo',
    'SpeedAchievement': 'You earned a new badge for being blazing fast! Your were #{rank} in finishing in "{exerciseName}".',
    'spritesNotEqual': 'World is not equal to the exercise description.',
    'startDate': 'Start Date',
    'status': 'Status',
    'step': 'Step',
    'steps': 'Steps',
    'StepsAchievement': 'Yet another efficient solution! Total: {count}.',
    'StepsMasterAchievement': 'You have earned a new badge for efficient solutions!',
    'subject': 'Subject',
    'Submitted': 'Submitted',
    'technology.label': 'Cutting-Edge',
    'technology.info': 'We are standing on top of the shoulders of giants, using the latest cutting edge technology to bring you the best learning experience.',
    'theme.animations': 'Animations',
    'theme.editorColor': 'Editor Color',
    'theme.images': 'Images',
    'theme.lineColor': 'Line Color',
    'theme.lineHighlightColor': 'Line Highlight Color',
    'theme.lineWidth': 'Line Width',
    'theme.name': 'Theme Name',
    'theme.scale': 'Scale',
    'theme.spacing': 'Spacing',
    'theme.tile': 'Tile',
    'theme.tiles': 'Tiles',
    'theme.url': 'Url',
    'themes': 'Themes',
    'tile.className': 'Class Name',
    'tile.name': 'Tile Name',
    'tile.stamp': 'Stamp',
    'tile.tags': 'Tags',
    'toggleAll': 'Toggle All',
    'tutor.email': 'Email',
    'tutor.marking': 'Marking',
    'tutors.adminSubHeader': 'Please search for a schedule and select one to display its tutors',
    'tutors.label': 'Tutors',
    'twoStars': 'Two Stars',
    'unsavedChanges': 'You have unsaved changes, do you wish to save them?',
    'users': 'Users',
    'unsubscribe': 'Unsubscribe',
    'validation.boardAdd': 'Add Validation Board',
    'validation.boardDelete': 'Delete Validation Board',
    'web.title': 'Clara\'s World',
    'world.addTheme': 'Add Theme',
    'world.globals': 'Global Variables',
    'world.globalVariable': 'Global Variable',
    'world.hasNoTheme': 'World has no active theme!',
    'world.name': 'Name',
    'world.themes': 'Themes',
    'world.tiles': 'Tiles',
    'world': 'World',
    'worldNum': 'World #',
    'worlds.label': 'Worlds',
    'worlds': 'Worlds',
    'wrap': 'Wrap'
  });
}
